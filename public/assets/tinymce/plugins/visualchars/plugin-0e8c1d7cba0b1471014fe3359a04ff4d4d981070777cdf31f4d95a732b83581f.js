tinymce.PluginManager.add("visualchars",function(e){function t(t){function n(e){return'<span data-mce-bogus="1" class="mce-'+p[e]+'">'+e+"</span>"}function o(){var e,t="";for(e in p)t+=e;return new RegExp("["+t+"]","g")}function a(){var e,t="";for(e in p)t&&(t+=","),t+="span.mce-"+p[e];return t}var s,l,c,u,d,f,p,m,g=e.getBody(),h=e.selection;if(p={"\xa0":"nbsp","\xad":"shy"},r=!r,i.state=r,e.fire("VisualChars",{state:r}),m=o(),t&&(f=h.getBookmark()),r)for(l=[],tinymce.walk(g,function(e){3==e.nodeType&&e.nodeValue&&m.test(e.nodeValue)&&l.push(e)},"childNodes"),c=0;c<l.length;c++){for(u=l[c].nodeValue,u=u.replace(m,n),d=e.dom.create("div",null,u);s=d.lastChild;)e.dom.insertAfter(s,l[c]);e.dom.remove(l[c])}else for(l=e.dom.select(a(),g),c=l.length-1;c>=0;c--)e.dom.remove(l[c],1);h.moveToBookmark(f)}function n(){var t=this;e.on("VisualChars",function(e){t.active(e.state)})}var r,i=this;e.addCommand("mceVisualChars",t),e.addButton("visualchars",{title:"Show invisible characters",cmd:"mceVisualChars",onPostRender:n}),e.addMenuItem("visualchars",{text:"Show invisible characters",cmd:"mceVisualChars",onPostRender:n,selectable:!0,context:"view",prependToContext:!0})});
