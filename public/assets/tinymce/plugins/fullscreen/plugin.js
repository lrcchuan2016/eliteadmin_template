tinymce.PluginManager.add("fullscreen",function(a){function b(){var a,b,c=window,d=document,e=d.body;return e.offsetWidth&&(a=e.offsetWidth,b=e.offsetHeight),c.innerWidth&&c.innerHeight&&(a=c.innerWidth,b=c.innerHeight),{w:a,h:b}}function c(){var a=tinymce.DOM.getViewPort();return{x:a.x,y:a.y}}function d(a){scrollTo(a.x,a.y)}function e(){function e(){m.setStyle(p,"height",b().h-(o.clientHeight-p.clientHeight))}var n,o,p,q,r=document.body,s=document.documentElement;l=!l,o=a.getContainer(),n=o.style,p=a.getContentAreaContainer().firstChild,q=p.style,l?(k=c(),f=q.width,g=q.height,q.width=q.height="100%",i=n.width,j=n.height,n.width=n.height="",m.addClass(r,"mce-fullscreen"),m.addClass(s,"mce-fullscreen"),m.addClass(o,"mce-fullscreen"),m.bind(window,"resize",e),e(),h=e):(q.width=f,q.height=g,i&&(n.width=i),j&&(n.height=j),m.removeClass(r,"mce-fullscreen"),m.removeClass(s,"mce-fullscreen"),m.removeClass(o,"mce-fullscreen"),m.unbind(window,"resize",h),d(k)),a.fire("FullscreenStateChanged",{state:l})}var f,g,h,i,j,k,l=!1,m=tinymce.DOM;return a.settings.inline?void 0:(a.on("init",function(){a.addShortcut("Ctrl+Shift+F","",e)}),a.on("remove",function(){h&&m.unbind(window,"resize",h)}),a.addCommand("mceFullScreen",e),a.addMenuItem("fullscreen",{text:"Fullscreen",shortcut:"Ctrl+Shift+F",selectable:!0,onClick:function(){e(),a.focus()},onPostRender:function(){var b=this;a.on("FullscreenStateChanged",function(a){b.active(a.state)})},context:"view"}),a.addButton("fullscreen",{tooltip:"Fullscreen",shortcut:"Ctrl+Shift+F",onClick:e,onPostRender:function(){var b=this;a.on("FullscreenStateChanged",function(a){b.active(a.state)})}}),{isFullscreen:function(){return l}})});