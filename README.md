# 🚀 SocialHub - CamarAI

> **Herramienta de gestión y generación de contenido para redes sociales**  
> Desarrollado con ❤️ por **Society** | Soporte técnico: **FenixReload** | Prompting: **Gabri**

---

## Problemas a resolver con FenixReload v2 (🔥GRAVE/URGENTE🔥)

- **Imagenes en b64**: Es necesaria una indicacion de como inyectar base64 en una etiqueta img, no se esta agregando la cabecera "data:image/jpeg;base64,...".
- **Lisener para gestionar la carga**: Necesitamos algo que nos permita escuchar al framework para poder mostrar un loader mientras se hace la peticion.

## 📋 Descripción del Proyecto

**SocialHub** es una aplicación web moderna y elegante diseñada para la gestión y generación de contenido para redes sociales. La herramienta combina un diseño inspirado en las **Apple Human Interface Guidelines** con una arquitectura robusta basada en **FenixReload Framework v2**.

### 🎯 Objetivos Principales
- **Generación inteligente** de contenido para RRSS
- **Gestión centralizada** de publicaciones
- **Interfaz intuitiva** siguiendo principios de UX/UI modernos
- **Responsive design** optimizado para todos los dispositivos

---

## 🏗️ Arquitectura Técnica

### **Framework Base: FenixReload v2**
La aplicación está construida sobre **FenixReload Framework v2**, un framework JavaScript avanzado que proporciona:

- **Sistema de componentes modulares** con carga dinámica
- **Gestión de estado reactiva** 
- **Integración con APIs** mediante WebSockets y HTTP
- **Sistema de routing** basado en atributos HTML
- **Gestión de notificaciones** nativas del navegador

### **Integración con FenixReload**

```javascript
// Sistema de componentes dinámicos
<generar load="generar.html"></generar>
<gestionar load="gestionar.html"></gestionar>

// Configuración de API
<server>
    <api host="https://" 
         headers="Content-Type" 
         Content-Type="application/json">
    </api>
</server>
```

**Características técnicas:**
- **Carga asíncrona** de componentes HTML
- **Comunicación bidireccional** con servidor
- **Gestión automática** de eventos y estados
- **Sistema de notificaciones** integrado

---

## 🎨 Diseño y UX/UI

### **Apple Human Interface Guidelines**
El diseño sigue estrictamente las **Apple Human Interface Guidelines** para crear una experiencia de usuario premium:

#### **Principios Aplicados:**
- **Clarity**: Interfaz limpia y legible
- **Deference**: El contenido es el protagonista
- **Depth**: Jerarquía visual clara con efectos de profundidad

#### **Elementos de Diseño:**
- **Glassmorphism**: Efectos de cristal con `backdrop-filter`
- **Gradientes sutiles**: Paleta de colores moderna
- **Animaciones fluidas**: Transiciones suaves con `cubic-bezier`
- **Tipografía**: Poppins para legibilidad óptima

### **Sistema de Colores**
```css
/* Paleta principal */
--primary: #a900ff (Púrpura CamarAI)
--secondary: #00f8f1 (Cian vibrante)
--background: #141414 (Negro profundo)
--glass: rgba(255, 255, 255, 0.08) (Cristal translúcido)
```

---

## 📱 Responsive Design

### **Media Queries Estratégicas**

#### **Desktop (>1024px)**
- Layout de 2 columnas para generador
- Navegación horizontal
- Espaciado generoso

#### **Tablet (≤1024px)**
```css
@media (max-width: 1024px) {
    .content-container {
        max-height: calc(100vh - 380px);
        min-height: 200px;
        overflow-y: auto;
    }
}
```

#### **Mobile (≤768px)**
```css
@media (max-width: 768px) {
    .main-content {
        padding: 1rem 0.5rem;
        gap: 1.5rem;
    }
    
    .content-container {
        max-height: calc(100vh - 420px);
    }
}
```

#### **Small Mobile (≤480px)**
```css
@media (max-width: 480px) {
    .content-container {
        max-height: calc(100vh - 350px);
        min-height: 100px;
    }
}
```

### **Optimizaciones Responsive:**
- **Contenedores adaptativos** con `max-width` y `min-height`
- **Scroll interno** cuando el contenido excede el viewport
- **Navegación colapsable** en dispositivos móviles
- **Tipografía escalable** con `clamp()`

---

## 🛠️ Funcionalidades

### **1. Generador de Contenido**
- **Formulario inteligente** con validación en tiempo real (EN PROCESO)
- **Preview en vivo** del contenido generado (EN PROCESO)
- **Múltiples formatos** de publicación
- **Gestión de metadatos** y hashtags

### **2. Gestión de Contenido**
- **Dashboard centralizado** para todas las publicaciones (EN PROCESO, ACTUALMENTE DATOS ESTATICOS)
- **Sistema de filtros** avanzado (búsqueda, formato, fecha, estado) 
- **Estados de publicación** (borrador, aprobado, descartado)
- **Acciones en lote** para gestión eficiente (EN PROCESO, ACTUALMENTE DEMO)

### **3. Características Avanzadas**
- **Auto-guardado** de formularios (EN PROCESO)
- **Notificaciones** del sistema (EN PROCESO)
- **Modo oscuro** nativo
- **Accesibilidad** completa (WCAG 2.1) (EN PROCESO)

---

## 🚀 Instalación y Uso

### **Requisitos del Sistema**
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript habilitado
- Conexión a internet para APIs

### **Estructura del Proyecto**
```
socialhub.camarai.es/
├── index.html              # Página principal
├── generar.html            # Componente generador
├── gestionar.html          # Componente gestión
├── styles.css              # Estilos principales
├── fr_v2_release.js        # Framework FenixReload
├── assets/
│   └── camarai.gif         # Mascota CamarAI
└── README.md               # Documentación
```

### **Despliegue**
1. Clonar el repositorio
2. Servir archivos estáticos
3. Configurar CORS si es necesario
4. ¡Listo para usar!

---

## 🔧 Configuración Avanzada

### **Personalización de APIs**
```html
<server>
    <api host="TU_API_URL" 
         headers="Authorization" 
         Authorization="Bearer TOKEN">
    </api>
</server>
```

### **Temas Personalizados**
```css
:root {
    --primary-color: #tu-color;
    --secondary-color: #tu-color-secundario;
    --background-color: #tu-fondo;
}
```

---

## 🎯 Roadmap

### **Versión Actual (v1.0)**
- ✅ Generador de contenido básico
- ✅ Gestión de publicaciones
- ✅ Diseño responsive
- ✅ Integración FenixReload

### **Próximas Versiones**
- 🔄 **v1.1**: Integración con APIs de RRSS
- 🔄 **v1.2**: Sistema de plantillas
- 🔄 **v1.3**: Analytics y métricas
- 🔄 **v2.0**: IA integrada para optimización

---

## 👥 Equipo de Desarrollo

| Rol | Responsable | Contribución |
|-----|-------------|--------------|
| **Desarrollo Principal** | Society | Arquitectura y desarrollo |
| **Soporte Técnico** | FenixReload | Framework y optimización |
| **Prompting** | Gabri | IA y contenido |

---

## 📄 Licencia

**© 2025 CamarAI & Society** - Todos los derechos reservados

---

*Desarrollado con ❤️ siguiendo las mejores prácticas de UX/UI y arquitectura moderna*