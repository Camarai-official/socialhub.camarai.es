// ===========================================
//  REUSABLE INITIALIZATION LOGIC
// ===========================================

/**
 * Función genérica para inicializar pestañas móviles dentro de un contenedor.
 * @param {HTMLElement} containerElement El elemento contenedor del componente.
 */
function initializeMobileTabs(containerElement) {
    const tabButtons = containerElement.querySelectorAll('.mobile-tab-btn');
    const contentPanels = containerElement.querySelectorAll('[data-content]');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
            contentPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.content === targetTab));
        });
    });
}

/**
 * Función para inicializar los botones de formato (Empresa/Camarai)
 * @param {HTMLElement} containerElement El elemento contenedor del componente.
 */
function initializeFormatButtons(containerElement) {
    const formatButtons = containerElement.querySelectorAll('.format-btn');
    const hiddenInput = containerElement.querySelector('#content-format-selected');
    
    if (formatButtons.length === 0) return;
    
    formatButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            formatButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            // Obtener el valor del radio button asociado
            const radioInput = button.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
                
                // Actualizar el input hidden
                if (hiddenInput) {
                    hiddenInput.value = radioInput.value;
                }
                
                console.log('[PostGenerator] Format changed to:', radioInput.value);
            }
        });
    });
}

// ===========================================
//  COMPONENT-SPECIFIC INITIALIZERS
// ===========================================

function initializePostGenerator(container) {
    console.log('[Component] Initializing: Generar');
    initializeMobileTabs(container);
    initializeFormatButtons(container);

    const form = container.querySelector('#post-generator-form');
    const previewContainer = document.querySelector('#generar-preview-data');

    if (!form || !previewContainer) return;

    const submitBtn = form.querySelector('.generate-btn');
    if (!submitBtn) return;

    // --- Observer específico para detectar fin de carga ---
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const style = node.getAttribute('style');
                        if (style && style.includes('display: none')) {
                            console.log('[PostGenerator] Se eliminó un display:none, carga completada.');
                            endGeneration();
                        }
                    }
                });
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const style = mutation.oldValue;
                if (style && style.includes('display: none')) {
                    console.log('[PostGenerator] Elemento pasó de none → visible, carga completada.');
                    endGeneration();
                }
            }
        }
    });

    observer.observe(previewContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['style']
    });

    // --- Función para terminar el estado de carga ---
    function endGeneration() {
        submitBtn.innerHTML = '<span class="btn-icon">✨</span>Generar Post';
        submitBtn.disabled = false;
    }

    // --- Evento del formulario ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.innerHTML = '<span class="btn-icon">⏳</span>Generando...';
        submitBtn.disabled = true;

        const text2 = document.querySelector('#generar-preview-data[style*="display: block"] .placeholder-text');
        console.log('[PostGenerator] Generando con prompt:', text2?.textContent || '(sin texto)');
    });
}


function autoRemoveHidden(containerSelector, onElementRemoved = null) {
    const tryInit = () => {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.warn('[AutoRemoveHidden] Container not found:', containerSelector);
            // Reintenta en intervalos hasta que aparezca
            setTimeout(tryInit, 500);
            return;
        }

        console.log('[AutoRemoveHidden] Observando:', containerSelector);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        removeHiddenRecursively(node, onElementRemoved);
                    });
                }

                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    removeHiddenRecursively(mutation.target, onElementRemoved);
                }
            });
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    };

    tryInit();
}

// Función de limpieza con callback para notificar eliminaciones
function removeHiddenRecursively(node, onElementRemoved = null) {
    if (node.nodeType !== 1) return; // solo elementos
    const display = window.getComputedStyle(node).display;
    if (display === 'none') {
        console.log('[AutoRemoveHidden] Removiendo elemento oculto:', node);
        node.remove();
        // Disparar callback si se proporciona
        if (onElementRemoved) {
            onElementRemoved(node);
        }
        return;
    }

    node.querySelectorAll('*').forEach(child => {
        const childDisplay = window.getComputedStyle(child).display;
        if (childDisplay === 'none') {
            console.log('[AutoRemoveHidden] Removiendo hijo oculto:', child);
            child.remove();
            // Disparar callback si se proporciona
            if (onElementRemoved) {
                onElementRemoved(child);
            }
        }
    });
}





function initializeGestionar(container) {
    console.log('[Component] Initializing: Gestionar');
    initializeMobileTabs(container);
    
    // Inicializar filtros de estado
    initializeStatusFilters();
    initializePostActions();
    
    // Configurar observer para procesar datos cuando lleguen
    setupPostsDataObserver();
    
    // Auto-cargar posts al inicializar
    autoLoadPosts();
}

/**
 * Función para configurar el observer que detectará cuando lleguen los datos
 */
function setupPostsDataObserver() {
    const postsDataContainer = document.getElementById('posts-data-container');
    if (!postsDataContainer) {
        console.warn('[Gestionar] Posts data container not found');
        return;
    }
    
    console.log('[Gestionar] Setting up posts data observer');
    
    // Crear observer para detectar cambios en el contenedor de datos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                console.log('[Gestionar] Data received, processing...');
                
                // Obtener el contenido JSON del contenedor
                const jsonContent = postsDataContainer.textContent || postsDataContainer.innerHTML;
                
                try {
                    // Parsear el JSON
                    const postsData = JSON.parse(jsonContent);
                    console.log('[Gestionar] Parsed posts data:', postsData);
                    
                    // Procesar los posts
                    processPostsResponse(postsData);
                    
                    // Limpiar el contenedor después de procesar
                    postsDataContainer.innerHTML = '';
                    
                } catch (error) {
                    console.error('[Gestionar] Error parsing posts data:', error);
                    console.log('[Gestionar] Raw content:', jsonContent);
                }
            }
        });
    });
    
    // Observar cambios en el contenedor
    observer.observe(postsDataContainer, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

/**
 * Función para cargar posts automáticamente al inicializar gestionar
 */
function autoLoadPosts() {
    console.log('[Gestionar] Auto-loading posts...');
    
    // Buscar el botón invisible y disparar el click
    const autoLoadBtn = document.getElementById('auto-load-posts-btn');
    if (autoLoadBtn) {
        console.log('[Gestionar] Triggering auto-load button');
        autoLoadBtn.click();
    } else {
        console.warn('[Gestionar] Auto-load button not found');
    }
}

/**
 * Función para procesar la respuesta de posts y crear las tarjetas
 * Esta función se ejecutará cuando Fenix Reload reciba la respuesta
 */
function processPostsResponse(postsData) {
    console.log('[Gestionar] Processing posts response:', postsData);
    
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error('[Gestionar] Posts container not found');
        return;
    }
    
    // Limpiar contenido existente
    postsContainer.innerHTML = '';
    
    // Verificar si postsData es un array
    const posts = Array.isArray(postsData) ? postsData : [postsData];
    
    posts.forEach((post, index) => {
        console.log(`[Gestionar] Creating post card ${index + 1}:`, post);
        createPostCard(post, postsContainer);
    });
}

/**
 * Función para crear una tarjeta de post individual
 */
function createPostCard(postData, container) {
    const template = document.getElementById('post-card-template');
    if (!template) {
        console.error('[Gestionar] Post card template not found');
        return;
    }
    
    // Clonar el template
    const postCard = template.content.cloneNode(true);
    
    // Mapear datos de la respuesta JSON a la estructura del post-card
    const cardElement = postCard.querySelector('.post-card');
    const imgElement = postCard.querySelector('.post-image img');
    const titleElement = postCard.querySelector('.post-title');
    const descriptionElement = postCard.querySelector('.post-description');
    const statusBadge = postCard.querySelector('.status-badge');
    const formatBadge = postCard.querySelector('.format-badge');
    
    // Configurar atributos del card
    cardElement.setAttribute('data-post-id', postData.post_id || '');
    cardElement.setAttribute('data-status', mapStatusToData(postData.status_name));
    cardElement.setAttribute('data-format', mapFormatToData(postData.content_format_name));
    
    // Configurar imagen
    if (postData.img_url) {
        imgElement.src = postData.img_url;
        imgElement.alt = postData.title || 'Post Image';
    }
    
    // Configurar título
    if (titleElement && postData.title) {
        titleElement.textContent = postData.title;
    }
    
    // Configurar descripción (usar body truncado)
    if (descriptionElement && postData.body) {
        const truncatedBody = postData.body.length > 150 ? 
            postData.body.substring(0, 150) + '...' : 
            postData.body;
        descriptionElement.textContent = truncatedBody;
    }
    
    // Configurar badges
    if (statusBadge) {
        statusBadge.textContent = postData.status_name || 'Sin estado';
        statusBadge.className = `status-badge status-${mapStatusToData(postData.status_name)}`;
    }
    
    if (formatBadge) {
        formatBadge.textContent = mapFormatToDisplay(postData.content_format_name);
        formatBadge.className = `format-badge format-${mapFormatToData(postData.content_format_name)}`;
    }
    
    // Configurar botones de acción
    const editBtn = postCard.querySelector('.action-btn[onclick="editPost()"]');
    const deleteBtn = postCard.querySelector('.action-btn[onclick="deletePost()"]');
    const statusBtn = postCard.querySelector('.status-change-btn');
    
    if (editBtn) {
        editBtn.setAttribute('onclick', `editPost(${postData.post_id})`);
    }
    if (deleteBtn) {
        deleteBtn.setAttribute('onclick', `deletePost(${postData.post_id})`);
    }
    if (statusBtn) {
        statusBtn.setAttribute('onclick', `changePostStatus(${postData.post_id})`);
    }
    
    // Agregar al contenedor
    container.appendChild(postCard);
    
    console.log(`[Gestionar] Post card created for post ID: ${postData.post_id}`);
}

/**
 * Función para mapear el estado de la respuesta al atributo data-status
 */
function mapStatusToData(statusName) {
    const statusMap = {
        'Borrador': 'borrador',
        'Aprobado': 'aprobado', 
        'Descartado': 'descartado',
        'Publicado': 'publicado'
    };
    return statusMap[statusName] || 'borrador';
}

/**
 * Función para mapear el formato de la respuesta al atributo data-format
 */
function mapFormatToData(formatName) {
    const formatMap = {
        'empresa': 'empresa',
        'camarai': 'camarai'
    };
    return formatMap[formatName] || 'empresa';
}

/**
 * Función para mapear el formato para mostrar en el badge
 */
function mapFormatToDisplay(formatName) {
    const displayMap = {
        'empresa': 'Empresa',
        'camarai': 'Camarai'
    };
    return displayMap[formatName] || 'Empresa';
}

// ===========================================
//  GESTIONAR SPECIFIC FUNCTIONALITY
// ===========================================

function initializeStatusFilters() {
    const statusOptions = document.querySelectorAll('.status-option input[type="radio"]');
    const postCards = document.querySelectorAll('.post-card');
    
    statusOptions.forEach(option => {
        option.addEventListener('change', function() {
            const selectedStatus = this.value;
            console.log('[Gestionar] Filtering by status:', selectedStatus);
            
            postCards.forEach(card => {
                const cardStatus = card.dataset.status;
                if (selectedStatus === 'todos' || cardStatus === selectedStatus) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initializePostActions() {
    // Initialize search filter
    const searchFilter = document.getElementById('search-filter');
    if (searchFilter) {
        searchFilter.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const postCards = document.querySelectorAll('.post-card');
            
            postCards.forEach(card => {
                const title = card.querySelector('.post-title').textContent.toLowerCase();
                const description = card.querySelector('.post-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize format filter
    const formatFilter = document.getElementById('format-filter');
    if (formatFilter) {
        formatFilter.addEventListener('change', function() {
            const selectedFormat = this.value;
            const postCards = document.querySelectorAll('.post-card');
            
            postCards.forEach(card => {
                const cardFormat = card.dataset.format;
                if (selectedFormat === '' || cardFormat === selectedFormat) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// ===========================================
//  MODAL FUNCTIONALITY
// ===========================================

let currentPostId = null;

function changePostStatus(postId) {
    currentPostId = postId;
    const modal = document.getElementById('status-modal');
    if (modal) {
        modal.classList.add('active');
        console.log('[Gestionar] Opening status change modal for post:', postId);
    }
}

function closeStatusModal() {
    const modal = document.getElementById('status-modal');
    if (modal) {
        modal.classList.remove('active');
        currentPostId = null;
        console.log('[Gestionar] Closing status change modal');
    }
}

function confirmStatusChange() {
    const selectedStatus = document.querySelector('input[name="new-status"]:checked');
    if (selectedStatus && currentPostId) {
        const newStatus = selectedStatus.value;
        console.log('[Gestionar] Changing post', currentPostId, 'status to:', newStatus);
        
        // Update the post card
        const postCard = document.querySelector(`[data-post-id="${currentPostId}"]`) || 
                        document.querySelectorAll('.post-card')[currentPostId - 1];
        if (postCard) {
            postCard.dataset.status = newStatus;
            const statusBadge = postCard.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge status-${newStatus}`;
                statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
            }
        }
        
        closeStatusModal();
    }
}

function editPost(postId) {
    console.log('[Gestionar] Editing post:', postId);
    // TODO: Implement edit functionality
}

function deletePost(postId) {
    console.log('[Gestionar] Deleting post:', postId);
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
        const postCard = document.querySelectorAll('.post-card')[postId - 1];
        if (postCard) {
            postCard.remove();
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('status-modal');
    if (modal && e.target === modal) {
        closeStatusModal();
    }
});

// ===========================================
//  MAIN PAGE & FRAMEWORK INTEGRATION
// ===========================================

function initializeExistingViews() {
    const generarView = document.querySelector('.generar-view');
    if (generarView && !generarView.dataset.initialized) {
        generarView.dataset.initialized = 'true';
        console.log('[App] Initializing: Generar (existing)');
        initializePostGenerator(generarView);
    }

    const gestionarView = document.querySelector('.gestionar-view');
    if (gestionarView && !gestionarView.dataset.initialized) {
        gestionarView.dataset.initialized = 'true';
        console.log('[App] Initializing: Gestionar (existing)');
        initializeGestionar(gestionarView);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('[App] DOM Content Loaded');
    
    // Inicializar componentes existentes inmediatamente
    initializeExistingViews();
    
    // Callback para cuando se elimina un elemento oculto
    const onElementRemoved = (removedElement) => {
        console.log('[App] Elemento oculto eliminado:', removedElement);
        
        // Buscar el botón de generar directamente en el DOM
        // ya que el elemento eliminado ya no existe para hacer closest()
        const submitBtn = document.querySelector('.generar-view .generate-btn');
        if (submitBtn && submitBtn.disabled) {
            console.log('[App] Cambiando estado de "Generando..." a "Generar Post"');
            try {
                document.querySelector('.image-icon svg').remove();
                document.querySelector('.image-text').remove();
            } catch (error) {
                
                // console.error('[App] Error al eliminar el icono y el texto:', error);
            }
            submitBtn.innerHTML = '<span class="btn-icon">✨</span>Generar Post';
            submitBtn.disabled = false;
        } else {
            console.log('[App] Botón no encontrado o no está deshabilitado:', submitBtn);
        }
    };
    
    autoRemoveHidden('.preview-section', onElementRemoved);
    
    // Animación de entrada
    const titleContainer = document.querySelector('.title-container');
    const navbar = document.querySelector('.navbar__floating');
    
    if (titleContainer && navbar) {
        titleContainer.style.opacity = '0';
        titleContainer.style.transform = 'translateY(-30px)';
        navbar.style.opacity = '0';
        navbar.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            titleContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            titleContainer.style.opacity = '1';
            titleContainer.style.transform = 'translateY(0)';
        }, 200);
        
        setTimeout(() => {
            navbar.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
        }, 600);
    }
});

// El MutationObserver para detectar nodos añadidos después
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return; // Solo elementos
                
                // Detectar .generar-view añadido
                if (node.matches('.generar-view') && !node.dataset.initialized) {
                    node.dataset.initialized = 'true';
                    console.log('[App] Initializing: Generar (added)');
                    initializePostGenerator(node);
                }
                
                // Detectar .gestionar-view añadido
                if (node.matches('.gestionar-view') && !node.dataset.initialized) {
                    node.dataset.initialized = 'true';
                    console.log('[App] Initializing: Gestionar (added)');
                    initializeGestionar(node);
                }
            });
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});