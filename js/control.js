function freshall(transt = 500)
{
    drawall(transt);
    legall(transt);
    refall();
}

function colorall(transt = 500)
{
    var colorb = document.getElementsByTagName("input");
    for(var i=0; i<colorb.length; i++)
    {
        if(colorb[i].type == 'color')
        {
            var da = colorb[i].id.replace("color_", "");
            var cc = Math.floor(Math.random()*16777215).toString(16);
            var ccl = cc.length;
            if(ccl < 6)
            { for(var ic = 0; ic<(6-ccl); ic++) { cc = '0' + cc; } }
            cc = '#' + cc;
            document.getElementById('color_'+da).value = cc;
            changeone(da, transt);
            changeoneleg(da, transt);
            changeoneref(da);
        }
    }
}

function clearall()
{
    var checkm = document.getElementsByClassName("checkmark");
    for(var i=0; i<checkm.length; i++)
        checkm[i].style = '';

    var checkb = document.getElementsByTagName("input");
    for(var i=0; i<checkb.length; i++)
    {
        if(checkb[i].type == 'checkbox')
        {
            if(checkb[i].checked == false) continue;
            checkb[i].checked = false;
            var da = checkb[i].id.replace("check_", "");
            clearone(da);
            refone(da);
            legone(da);
        }
    }
}

window.addEventListener("resize", function() { freshall(0); });

function changescale(id, transt = 500)
{
    var btnlog = document.getElementById(id);
    btnlog.value = 1 - btnlog.value;
    if(btnlog.value == 1)
    {
        btnlog.style.backgroundColor = "#1f77b4";
        btnlog.style.color = "white";
    }
    else
    {
        btnlog.style.backgroundColor = "#f5f5f5";
        btnlog.style.color = "black";
    }
    drawall(transt);
    legall(transt);
}

// Opacity series

function vlineopacity(transt = 400)
{
    var vline = d3.select("svg").select("g").select('#vline');
    var vo = 1 - document.getElementById('btnvline').value;
    vline.transition().attr('opacity', vo).duration(transt);
    document.getElementById('btnvline').value = vo;
}

function binningopacity(transt = 400)
{
    changetonext('btnbinning');
    var checkb = document.getElementsByTagName("input");
    for(var i=0; i<checkb.length; i++)
    {
        if(checkb[i].type !== 'checkbox') continue;
        var da = checkb[i].id.replace("check_", "");
        document.getElementById('display_'+da).value = document.getElementById('btnbinning').value;

        if(!checkb[i].checked) continue;
        drawdisplay(da, transt);
    }
}

function gridopacity(transt=500)
{
    var grid = d3.select("svg").select("g").selectAll('.grid');
    var next = {0 : 1, 1 : 0.8, 0.8 : 0.4, 0.4 : 0.2, 0.2 : 0};
    var newopa = next[document.getElementById('btngrid').value];
    grid.transition().attr('opacity', newopa).duration(transt);
    document.getElementById('btngrid').value = newopa;
}

function legendopacity() {
    legchangetonext('btnlegend');
    d3.select("svg").selectAll('.legend').remove();
    d3.select("svg").selectAll('.legendmark').remove();
    legall(0);
}
