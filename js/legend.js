var legdrawornot = function(name) {
    return document.getElementById('sw_'+name).classList.contains("active")?'default':'none';
}

function changeoneleg(da, transt = 0) // change color
{
    var kmarker = document.getElementById('marker_'+da).value;
    var thecolor = document.getElementById('color_'+da).value;
    d3.select("svg").select("#legendmark_"+da)
        .attr("d", d3.symbol().type(vopt[kmarker].type).size(marker_size()*vopt[kmarker].offset[0]))
        .transition()
        .attr('stroke', thecolor)
        .attr('fill', vopt[kmarker].fill==1?thecolor:'transparent')
        .duration(transt);
}

function legone(da, transt = 0)
{
    if(!checkb(da) && legs.includes(da)) // remove legend
    {
        d3.select("svg").select('#legend_'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select('#legendmark_'+da).transition().attr('opacity', 0).duration(transt);
        if(transt==0)
        {
            svg.select('#legend_'+da).remove();
            svg.select('#legendmark_'+da).remove();
        }
        else
            setTimeout(function() {
                svg.select('#legend_'+da).remove();
                svg.select('#legendmark_'+da).remove();
            }, transt);
        var ileg = legs.indexOf(da);
        legs.splice(ileg, 1);
        for(var l=ileg; l<legs.length; l++)
        {
            d3.select('svg').select('#legend_' + legs[l])
                .transition().attr("y", y0 + dy*l).duration(transt);
            changeyto("legendmark_"+legs[l], y0 + dy*l, transt);
        }
    }
    else if(!legs.includes(da)) // add legend
    {
        var thisitem = dataset[da];
        var ynow = y0 + legs.length*dy;
        legs.push(da);
        var tlegend = svg.append("text")
            .attr("x", x0 + dxmark)
            .attr("y", ynow)
            .attr("class", "legend")
            .attr("id", "legend_" + da)
            .attr('opacity', '0')
            .style("text-anchor", "start");
        legenditem(tlegend, thisitem, "legend_" + da);
        legendmarker(da, x0, ynow, transt);
        tlegend.transition().attr('opacity', 1.).duration(transt);
    }
}

function removelegall(transt = 0)
{
    d3.select("svg").selectAll('.legend').transition().attr('opacity', 0).duration(transt);
    d3.select("svg").selectAll('.legendmark').transition().attr('opacity', 0).duration(transt);
    if(transt)
    {
        setTimeout(function() {
            d3.select("svg").selectAll('.legend').remove();
            d3.select("svg").selectAll('.legendmark').remove();
        }, transt);
    }
    else
    {
        d3.select("svg").selectAll('.legend').remove();
        d3.select("svg").selectAll('.legendmark').remove();
    }
    legs = [];    
}

function legall(transt = 0)
{
    var copy_legs = legs;
    removelegall(transt);
    for(var l in copy_legs)
    {
        var da = copy_legs[l];
        if(document.getElementById('tr_'+da))
            legone(da, transt);
    }
}

function movelegendx()
{
    setbasic();
    d3.select("svg").selectAll(".legend").attr("x", x0+dxmark);
    d3.select("svg").selectAll(".legendmark").each(function() {
        changexto( d3.select(this).attr('id'), x0 );
    })
}

function movelegendy()
{
    setbasic();
    for(var l=0; l<legs.length; l++)
    {
        d3.select("svg").select("#legend_" + legs[l]).attr("y", y0 + l*dy);
        changeyto( "legendmark_" + legs[l], y0 + l*dy );
    }
}

function resizelegend()
{
    setbasic();
    for(var l=0; l<legs.length; l++)
    {
        d3.select("svg").select("#legend_" + legs[l]).attr("y", y0 + l*dy);
        changeyto( "legendmark_" + legs[l], y0 + l*dy );
    }
    d3.select("svg").selectAll(".legend").style("font-size", legsize+"em");
}

// ==> Protected: <==

function legendmarker(da, xx, yy, transt = 0)
{
    var kmarker = document.getElementById('marker_'+da).value;
    var thecolor = document.getElementById('color_'+da).value;
    var dsize = marker_size()*vopt[kmarker].offset[0];
    svg.append('path')
        .attr("d", d3.symbol().type(vopt[kmarker].type).size(dsize))
	.attr("transform", "translate(" + xx + "," + (yy-legsize*0.8) + ")")
        .attr('id', 'legendmark_' + da)
        .attr('class', 'legendmark')
        .attr('fill', vopt[kmarker].fill==1?thecolor:'transparent')
        .attr('stroke', thecolor)
        .attr('stroke-width', stroke_width())
        .attr('opacity', 0).transition()
        .attr('opacity', legdrawornot("mark")=='none'?0:1).duration(transt);
}

function changeyto(id, nexty, transt = 0)
{
    var original = svg.select('#'+id).attr("transform");
    var thisx = original.replace('translate(', '');
    thisx = thisx.replace(/,.+/, '');
    svg.select('#'+id).transition().attr("transform", 'translate(' + thisx + ',' + (nexty-legsize*0.8) + ')').duration(transt);
}

function changexto(id, nextx, transt = 0)
{
    var original = svg.select('#'+id).attr("transform");
    var thisy = original.replace(/[^,]*,/, '');
    thisy = thisy.replace(')', '');
    svg.select('#'+id).transition().attr("transform", 'translate(' + nextx + ',' + thisy + ')').duration(transt);
}

function parsescript(pa)
{
    var results = [];
    while(pa.length > 0)
    {
     	var i = pa.indexOf("<su"), j = pa.indexOf("</su");
        var substr = "";
        if(i > 0) substr = pa.substring(0, i);
        else if(j > 0) substr = pa.substring(0, j);
        else substr = pa;
	pa = pa.replace(substr, "");

        var icl = "";
	if(substr.indexOf("<sub>") > -1) { icl = icl + " tsub"; substr = substr.replace("<sub>", ""); }
        if(substr.indexOf("<sup>") > -1) { icl = icl + " tsup"; substr = substr.replace("<sup>", ""); }
	if(substr.indexOf("</su") > -1) substr = substr.replace(substr.substring(0, 6), "");

        results.push({
            content : substr,
            cl : icl
        });
    }
    return results;
}

function legenditem(tlegend, thisitem, tlegendid)
{
    var type_legend = document.getElementById('btnlegend').value;
    tlegend.style('font-size', legsize + "em");
    
    // observable
    var rpc = parsescript(styleobs(thisitem.observable));
    for(var p in rpc)
    {
        tlegend.append('tspan')
            .attr("class", rpc[p].cl)
            .attr("dominant-baseline", "middle")
            .attr('display', legdrawornot("observable"))
            .text(decodehtml(rpc[p].content));
    }
    // particle
    var rpp = parsescript(thisitem.particle);
    rpp[0].content = " " + rpp[0].content;
    for(var p in rpp)
    {
        tlegend.append('tspan')
            .attr("class", rpp[p].cl)
            .attr("dominant-baseline", "middle")
            .attr('display', legdrawornot("particle"))
            .text(decodehtml(rpp[p].content));
    }
    // collab
    tlegend.append('tspan')
        .attr("dominant-baseline", "middle")
        .attr('display', legdrawornot("collab"))
        .text(' (' + thisitem.collab + ')');
    // collision1
    var rpc = parsescript(thisitem.collision);
    rpc[0].content = " " + rpc[0].content;
    for(var p in rpc) {
        tlegend.append('tspan')
               .attr("class", rpc[p].cl)
               .attr("dominant-baseline", "middle")
               .attr('display', legdrawornot("collision1"))
               .text(decodehtml(rpc[p].content));
    }
    // collision2
    tlegend.append('tspan')
        .attr("dominant-baseline", "middle")
        .style("font-style", "italic")
        .attr('display', legdrawornot("collision2"))
        .text('  ' + thisitem.energy);
    // kinea
    var rpa = parsescript(thisitem.kinea);
    if(thisitem.kinea != "")
        rpa[0].content = '  ' + rpa[0].content;
    for(var p in rpa)
    {
        tlegend.append('tspan')
            .attr("class", rpa[p].cl)
            .attr("dominant-baseline", "middle")
            .attr('display', legdrawornot("kinea"))
            .text(decodehtml(rpa[p].content));
    }
    // kineb
    var rpb = parsescript(thisitem.kineb);
    if(thisitem.kineb != "")
        rpb[0].content = '  ' + rpb[0].content;
    for(var p in rpb)
    {
        tlegend.append('tspan')
            .attr("class", rpb[p].cl)
            .attr("dominant-baseline", "middle")
            .attr('display', legdrawornot("kineb"))
            .text(decodehtml(rpb[p].content));
    }

    settsuptsub(tlegendid);
}


function styleobs(tobs)
{
    if(tobs=="RAA") return "R<sub>AA</sub>";
    if(tobs=="RpA") return "R<sub>pA</sub>";
    if(tobs=="v2") return "v<sub>2</sub>";
    if(tobs=="v3") return "v<sub>3</sub>";
    if(tobs=="v1") return "v<sub>1</sub>";
    return "";
}
