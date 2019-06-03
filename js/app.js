
if (!document.all) { document.captureEvents(Event.MouseMove); }
    document.onmousemove = position;
    
function position (evenement)
{
    element = document.all?event.srcElement:evenement.target;
    if (element.name != "image") return;
    document.formulaire.x.value = document.all?event.x:evenement.layerX;
    document.formulaire.y.value = document.all?event.y:evenement.layerY;
}

function bougerCadre (event)
{
    document.getElementById('cadre').style.position = 'absolute';
    document.getElementById('cadre').style.left = window.scrollX+event.clientX + 'px';
    document.getElementById('cadre').style.top = window.scrollY+event.clientY + 'px';
    document.getElementById('cadre').innerHTML = "("+Math.trunc(window.scrollX+event.clientX)+";"+Math.trunc(window.scrollY+event.clientY)+")"
}
