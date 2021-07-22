
var width, height;
var svg;
var margin, chartWidth, chartHeight;

var xmin, xmax, ymin, ymax;
var x, y;

// legend -->
var x0, y0, dy;
var legs = [];
// <-- legend

var checklogx = function()
{
    return (document.getElementById('logx').value == 1);
}

var checklogy = function()
{
    return (document.getElementById('logy').value == 1);
}

function changerangewlog()
{
    var varkey = document.getElementById('observable').value + "+" + document.getElementById('xvariable').value;
    if(checklogx() && xmin <= 0)
    {
        xmin = drange[varkey].pxmin_log;
        document.getElementById('pxmin').value = xmin;
    }
    if(checklogx() && xmax <= 0)
    {
        xmax = 1;
        document.getElementById('pxmax').value = xmax;
    }
    if(checklogy() && ymin <= 0)
    {
        ymin = drange[varkey].pymin_log;
        document.getElementById('pymin').value = ymin;
    }
    if(checklogy() && ymax <= 0)
    {
        ymax = 1;
        document.getElementById('pymax').value = ymax;
    }
}

var setscale = function()
{
    width = document.getElementById('rightpad').clientWidth*0.93;
    height = width * 0.695;

    svg = d3.select('svg').attr('width', width).attr('height', height)
        .attr('font-family', 'sans-serif')
        .attr('font-size', width/100.);

    margin = { top: height*0.06, right: width*0.05, bottom: height*0.13, left: width*0.14 },
    chartWidth = width - margin.left - margin.right,
    chartHeight = height - margin.top - margin.bottom;

    xmin = Math.min(document.getElementById('pxmin').value,
                    document.getElementById('pxmax').value);
    xmax = Math.max(document.getElementById('pxmin').value,
                    document.getElementById('pxmax').value);
    ymin = Math.min(document.getElementById('pymin').value,
                    document.getElementById('pymax').value);
    ymax = Math.max(document.getElementById('pymin').value,
                    document.getElementById('pymax').value);
    changerangewlog();

    x0 = margin.left + chartWidth/89.*(document.getElementById('x0range').value-10);
    y0 = margin.top + chartHeight/89.*(document.getElementById('y0range').value-10);
    dy = chartHeight/15.;

    if(checklogx())
        x = d3.scaleLog().range([0, chartWidth]).domain([xmin, xmax]);
    else
        x = d3.scaleLinear().range([0, chartWidth]).domain([xmin, xmax]);
    if(checklogy())
        y = d3.scaleLog().range([chartHeight, 0]).domain([ymin, ymax]);
    else
        y = d3.scaleLinear().range([chartHeight, 0]).domain([ymin, ymax]);
    
}

// create svg
var setsvg = function()
{
    // document.getElementsByTagName("svg")[0];//.style("background: white;");
    setscale();
    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    drawaxisgrid();
}

// axes
var drawaxisgrid = function()
{
    var ticksx = checklogx()?5:8, ticksy = checklogy()?5:5;
    var ticksize = -5;
    var xGrid = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .attr("class", "grid")
        .attr('opacity', document.getElementById('btngrid').value)
        .attr('stroke-width', width/100.*0.25)
        .call( d3.axisBottom(x).tickSize(-chartHeight).ticks(ticksx).tickFormat("").tickSizeOuter(0) );
    var yGrid = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr("class", "grid")
        .attr('opacity', document.getElementById('btngrid').value)
        .attr('stroke-width', width/100.*0.25)
        .call( d3.axisLeft(y).tickSize(-chartWidth).ticks(ticksy).tickFormat("").tickSizeOuter(0) );

    var obs = document.getElementById('observable').value;
    var vy = 0;
    if(obs == "RAA" || obs == "RpA" || obs == "RpARAA" || obs == "DoubleRatio") vy = 1;
    else if(obs == "LcToD0") vy = -10;

    if(vy > ymin && vy < ymax)
    {
        var vline = d3.select("svg").select("g")
            .append('line')
            .attr("class", "hline")
            .attr('id', 'vline')
            .attr('x1', function() { return x(xmin); })
            .attr('x2', function() { return x(xmax); })
            .attr('y1', function() { return y(vy); })
            .attr('y2', function() { return y(vy); })
            .attr('stroke', '#000')
            .attr('stroke-dasharray', '5,3')
            .attr('stroke-width', width/100.*0.25)
            .attr('opacity', document.getElementById('btnvline').value);
    }

    var xaxis = d3.axisBottom(x).tickSize(ticksize).tickSizeOuter(0).tickPadding(6*Math.pow(document.documentElement.clientWidth/document.documentElement.clientHeight, 0.3));
    if(checklogx()) xaxis.ticks(ticksx, "");
    else xaxis.ticks(ticksx);
    var yaxis = d3.axisLeft(y).tickSize(ticksize).tickSizeOuter(0).tickPadding(5*Math.pow(document.documentElement.clientWidth/document.documentElement.clientHeight, 0.6));
    if(checklogy()) yaxis.ticks(ticksy, "");
    else yaxis.ticks(ticksy);
    var xAxis = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .attr("class", "axis")
        .call( xaxis );
    var yAxis = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr("class", "axis")
        .call( yaxis );
    var xLine = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr("class", "axis")
        .call( d3.axisBottom(x).tickFormat("").tickSize(0).ticks(ticksx).tickSizeOuter(0) );
    var yLine = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(' + chartWidth + ',0)')
        .attr("class", "axis")
        .call( d3.axisLeft(y).tickFormat("").tickSize(0).ticks(ticksy).tickSizeOuter(0) );

    var xtitle = svg.append("text")
        .attr("transform",
              "translate(" + (chartWidth/2. + margin.left) + " ," +
              (chartHeight + margin.top + margin.bottom/1.3) + ")")
        .style("text-anchor", "middle")

    if(document.getElementById('xvariable').value === "pT")
    {
        xtitle.append('tspan').attr('class', 'axistitle')
            .text('p')
            .append('tspan').attr('class', 'tsub')
            .text('T');
        xtitle.append('tspan').attr('class', 'axistitle')
            .text(' (GeV/c)');
    }
    else if(document.getElementById('xvariable').value === "y")
    {
        xtitle.append('tspan').attr('class', 'axistitle')
            .text('y')
            .append('tspan').attr('class', 'tsub')
            .text('CM');
    }
    else if(document.getElementById('xvariable').value === "absy")
    {
        xtitle.append('tspan').attr('class', 'axistitle')
            .text('|y')
            .append('tspan').attr('class', 'tsub')
            .text('CM');
        xtitle.append('tspan').attr('class', 'axistitle')
            .text('|');
    }
    else if(document.getElementById('xvariable').value === "cent")
    {
        xtitle.append('tspan').attr('class', 'axistitle')
            .text('Centrality');
    }
    else if(document.getElementById('xvariable').value === "Npart")
    {
        xtitle.append('tspan').attr('class', 'axistitle')
            .text(decodehtml('&#10216;N'))
            .append('tspan').attr('class', 'tsub')
            .text('part');
        xtitle.append('tspan').attr('class', 'axistitle')
            .text(decodehtml('&#10217;'));
    }

    var ytitle = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 3.8)
        .attr("x", 0 - (margin.top + chartHeight / 2.))
        .attr("class", "ytitle")
        .style("text-anchor", "middle")

    if(obs === "RAA")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('R')
            .append('tspan').attr('class', 'tsub')
            .text('AA');
    }
    else if(obs === "RpA")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('R')
            .append('tspan').attr('class', 'tsub')
            .text('pA');
    }
    else if(obs === "RpARAA")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('R')
            .append('tspan').attr('class', 'tsub')
            .text('pA');
        ytitle.append('tspan').attr('class', 'axistitle')
            .text(', R')
            .append('tspan').attr('class', 'tsub')
            .text('AA');
    }
    else if(obs === "v2")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('v')
            .append('tspan').attr('class', 'tsub')
            .text('2');
    }
    else if(obs === "v3")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('v')
            .append('tspan').attr('class', 'tsub')
            .text('3');
    }
    else if(obs === "vn")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('v')
            .append('tspan').attr('class', 'tsub')
            .text('n');
    }
    else if(obs === "LcToD0")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text(decodehtml('&Lambda;'))
            .append('tspan').attr('class', 'tsub')
            .text('c');
        ytitle.append('tspan').attr('class', 'axistitle')
            .text(' / D')
            .append('tspan').attr('class', 'tsup')
            .text('0');
    }
    else if(obs === "Ratio")
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('Yield ratio');
    }
    else if(obs === "DoubleRatio") // improvable if one can access the yield ratio name
    {
        ytitle.append('tspan').attr('class', 'axistitle')
            .text('(Yield ratio)')
            .append('tspan').attr('class', 'tsub')
            .text('AA');
        ytitle.append('tspan').attr('class', 'axistitle')
            .text(' / (Yield ratio)')
            .append('tspan').attr('class', 'tsub')
            .text('pp');
    }

    var tmark = svg.append("text")
        .attr("transform",
              "translate(" + (chartWidth + margin.left) + " ," +
              margin.top*0.8 + ")")
        .attr("class", "watermark")
        .style("text-anchor", "end")
        .style("font-variant", "small-caps")
    // .style("font-weight", "bold")
        .style("font-family", "Garamond")
        .text("Generated by boundino.github.io/hinHFplot");

}

var vlineopacity = function() {
    var vline = d3.select("svg").select("g").select('#vline');
    var vo = 1 - document.getElementById('btnvline').value;
    vline.attr('opacity', vo)
    document.getElementById('btnvline').value = vo;
}


var gridopacity = function(transt=500) {
    var grid = d3.select("svg").select("g").selectAll('.grid');
    var next = {0 : 1, 1 : 0.5, 0.5 : 0};
    var newopa = next[document.getElementById('btngrid').value];
    grid.transition().attr('opacity', newopa).duration(transt);
    document.getElementById('btngrid').value = newopa;
}


var addData = function(da, data, thecolor, kmarker, transt = 500) {

    var rects = d3.select("svg").select("g").selectAll('.rectd3'+da)
        .data(data);
    rects.enter()
        .append('rect')
        .attr('class', 'rectd3' + da)
        .merge(rects)
        .attr('x', function(d) { return Math.max(0, x(d.x) - chartWidth/80.); }) // box width = chartwidth/40.
        .attr('y', function(d) { return y(Math.min(d.y + d.systh, ymax)); })
        .attr('height', function(d) {
            if((d.y - d.systl) < ymax && (d.y + d.systh) > ymin)
                return y(Math.max(d.y - d.systl, ymin)) - y(Math.min(d.y + d.systh, ymax));
            else { return 0; }
        })
        .attr('width', function(d) {
            var low = x(d.x) - chartWidth/80.;
            if(low < 0) { low = 0; }
            var high = x(d.x) + chartWidth/80.;
            if(high > chartWidth) { high = chartWidth; }
            if(high > low) { return (high - low); }
            else { return 0; }})
        .transition().duration(transt)
        .attr('fill', thecolor)
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.3)
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax) { return 0.25; }
            else { return 0; }
        });

    var lines = d3.select("svg").select("g").selectAll('.lined3'+da)
        .data(data);
    lines.enter()
        .append('line')
        .attr('class', 'lined3' + da)
        .merge(lines)
        .attr('x1', function(d) { return x(d.x); })
        .attr('x2', function(d) { return x(d.x); })
        .attr('y1', function(d) {
            if((d.y - d.statl) < ymax && (d.y + d.stath) > ymin)
                return y(Math.min(d.y + d.stath, ymax));
            else { return 0; }
        })
        .attr('y2', function(d) {
            if((d.y - d.statl) < ymax && (d.y + d.stath) > ymin)
                return y(Math.max(d.y - d.statl, ymin));
            else { return 0; }
        })
        .transition().duration(transt)
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.3)
        .attr('opacity', function(d) {
	    if(d.x > xmin && d.x < xmax && (d.y - d.statl) < ymax && (d.y + d.stath) > ymin) { return 1; }
            else { return 0; }
        });
    ;

    var points = d3.select("svg").select("g").selectAll('.pointd3'+da)
        .data(data);
    if(kmarker==20) { m20(da, points, thecolor, transt); }
};

var m20 = function(da, point, thecolor, transt = 500)
{
    point.enter()
        .append('circle')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('cx', function(d) { return x(d.x); })
        .attr('cy', function(d) { return y(d.y); })
        .attr('r', width/120.)
        .transition().duration(transt)
        .attr('fill', thecolor)
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        });
};

var drawall = function(transt = 500)
{
    d3.selectAll("svg > *").remove();
    setsvg();

    var checkb = document.getElementsByTagName("input");
    for(var i=0; i<checkb.length; i++)
    {
        if(checkb[i].type == 'checkbox')
        {
            if(!checkb[i].checked) continue;
            var da = checkb[i].id.replace("check_", "");
            var thisitem = dataset[da];
            addData(da, thisitem.data, document.getElementById('color_'+da).value, 20, transt);
        }
    }

    addref();
}

var drawallwleg = function(transt = 500)
{
    drawall(transt);
    alllegend(transt);
}

var drawallnoleg = function(transt = 500)
{
    drawall(transt);
    legs = [];
}

var draw = function(da, transt = 500)
{
    var ichecked = document.getElementById('check_'+da).checked;
    if(ichecked)
    {
        d3.select("svg").select("g").selectAll('.rectd3'+da).remove();
        d3.select("svg").select("g").selectAll('.lined3'+da).remove();
        d3.select("svg").select("g").selectAll('.pointd3'+da).remove();

        var thisitem = dataset[da];
        addData(da, thisitem.data, document.getElementById('color_'+da).value, 20);
    }
    else
    {
        d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('opacity', 0).duration(transt);
    }

    addref();
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
            colorb[i].value = cc;

            d3.select("svg").select("g").selectAll('.rectd3'+da).attr('fill', cc);
            d3.select("svg").select("g").selectAll('.rectd3'+da).attr('stroke', cc);
            d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('stroke', cc).duration(transt);
            d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('fill', cc).duration(transt);

            if(!document.getElementById("check_"+da).checked) continue;
            d3.select("svg").select("#legendmark_"+da).transition().style('fill', cc).duration(transt);
        }
    }

    addref();
}

function clearall()
{
    var checkm = document.getElementsByClassName("checkmark");
    for(var i=0; i<checkm.length; i++)
        checkm[i].style = '';

    var checkb = document.getElementsByTagName("input");
    for(var i=0; i<checkb.length; i++)
    {
        var da;
        if(checkb[i].type == 'checkbox')
        {
            checkb[i].checked = false;
            da = checkb[i].id.replace("check_", "");
        }
        d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('opacity', 0).duration(500);
    }
    addref();

    d3.select("svg").selectAll('.legend').attr('opacity', 0).transition().duration(500);
    setTimeout(function() {
        d3.select("svg").selectAll('.legend').remove();
    }, 500);
    legs = [];
}

function parselegend(tlegend, thisitem)
{
    var pa = thisitem.particle;
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

        tlegend.append('tspan')
            .attr("class", icl)
            .style("font-weight", "bold")
            .text(decodehtml(substr));
    }
    tlegend.append('tspan')
        .style("class", "legendlabel")
        .text(' ' + thisitem.collab);
    tlegend.append('tspan')
        .style("class", "legendlabel")
        .style("font-style", "italic")
        .text(' ' + thisitem.collision + ' ' + thisitem.energy);
    if(thisitem.kinea != "")
    {
        tlegend.append('tspan')
            .style("class", "legendlabel")
            .text(', ' + decodehtml(thisitem.kinea));
    }
    if(thisitem.kineb != "")
    {
        tlegend.append('tspan')
            .style("class", "legendlabel")
            .text(', ' + decodehtml(thisitem.kineb));
    }
}

function legend(da, trans = 500)
{
    var icheck = document.getElementById('check_' + da);
    if(!icheck.checked) // remove legend
    {
        ilegend = svg.select('#legend_'+da);
        ilegend.remove();
        var ileg = legs.indexOf(da);
        legs.splice(ileg, 1);
        for(var l=ileg; l<legs.length; l++)
        {
            var lleg = d3.select('svg').select('#legend_' + legs[l]);
            lleg.transition().attr("y", y0 + dy*l).duration(trans);
        }
    }
    else  // add legend
    {
        var thisitem = dataset[da];
        var ynow = y0 + legs.length*dy;
        legs.push(da);
        var tlegend = svg.append("text")
            .attr("x", x0)
            .attr("y", ynow)
            .attr("class", "legend")
            .attr("id", "legend_" + da)
            .attr('opacity', '0')
	    .style("text-anchor", "start");
        tlegend.append('tspan')
            .attr("class", "legendmark")
            .attr("id", "legendmark_" + da)
            .style("fill", document.getElementById('color_'+da).value)
            .text(decodehtml("&#9679; "));
        parselegend(tlegend, thisitem);
        tlegend.transition().attr('opacity', document.getElementById('btnlegend').value).duration(trans);
    }
}

function relegend(da, transt = 500)
{
    var icheck = document.getElementById('check_' + da);
    var cc = document.getElementById('color_' + da).value;
    // var ileg = d3.select('svg').select('#legend_' + da);
    if(icheck.checked)
    {
        d3.select("svg").select("#legendmark_"+da).transition().style('fill', cc).duration(transt);
    }
}

function alllegend(transt = 500)
{
    var copy_legs = legs;
    legs = [];
    for(var l=0; l<copy_legs.length; l++)
        legend(copy_legs[l], transt);
}

function movelegendx()
{
    x0 = margin.left + chartWidth/89.*(document.getElementById('x0range').value-10);
    d3.select("svg").selectAll(".legend").attr("x", x0);
    document.getElementById('tx0').innerText = " " + document.getElementById('x0range').value;
}

function movelegendy()
{
    for(var l=0; l<legs.length; l++)
    {
        y0 = margin.top + chartHeight/89.*(document.getElementById('y0range').value-10);
        d3.select("svg").select("#legend_" + legs[l]).attr("y", y0 + l*dy);;
    }
    document.getElementById('ty0').innerText = " " + document.getElementById('y0range').value;
}

function legendopacity() {
    var tlegend = d3.select("svg").selectAll('.legend');
    var opa = 1 - document.getElementById('btnlegend').value;
    tlegend.transition().attr('opacity', opa).duration(500);
    document.getElementById('btnlegend').value = opa;
}

window.addEventListener("resize", function() { drawallwleg(0); });

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
    alllegend(transt);
}

