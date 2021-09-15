/////////////////////////////////////////////////////
//  Type  rect  rectl  line  linev  rectv  rectvl  //
//  0     1     0      1     1      0      0       //
//  1     1     0      1     0      0      0       //
//  2     1     1      1     0      0      0       //
//  3     1     1      1     1      0      0       //
//  4     0     1      1     1      0      0       //
//  5     0     1      1     0      0      0       //
//  6     0     0      1     0      1      0       //
//  7     0     0      1     1      1      0       //
//  8     0     0      1     1      1      1       //
//  9     0     0      1     0      1      1       //
//  10    0     0      1     0      0      1       //
//  11    0     0      1     1      0      1       //
/////////////////////////////////////////////////////

var width, height;
var svg;
var margin, chartWidth, chartHeight;

var xmin, xmax, ymin, ymax;
var x, y;

// legend -->
var x0, y0, dy;
var legs = [];
// <-- legend

var shadowopacity = 0.12;

var xoverflow = function(x)
{
    var val = Math.min(x, chartWidth);
    val = Math.max(val, 0);
    return val;
}
var yoverflow = function(y)
{
    var val = Math.min(y, chartHeight);
    val = Math.max(val, 0);
    console.log(y, " ==> " , val, " (", chartHeight, ")")
    return val;
}
var xthrow = function(x)
{
    if(x >=0 && x <= chartWidth) return x;
    else return 0-chartWidth*2;
}
var ythrow = function(y)
{
    if(y >=0 && y <= chartHeight) return y;
    else return 0-chartHeight*2;
}
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
    height = width * 0.72;

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
        .attr('stroke-width', width/100.*0.24)
        .call( d3.axisBottom(x).tickSize(-chartHeight).ticks(ticksx).tickFormat("").tickSizeOuter(0) );
    var yGrid = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr("class", "grid")
        .attr('opacity', document.getElementById('btngrid').value)
        .attr('stroke-width', width/100.*0.24)
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
            .attr('stroke-width', width/100.*0.24)
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

var binningopacity = function(transt = 400) {
    var next = {0 : 1, 1 : 2, 2 : 3, 3 : 4, 4 : 5, 5 : 6, 6 : 7, 7 : 8, 8 : 9, 9 : 10, 10 : 11, 11 : 0};
    var newtype = next[document.getElementById('btnbinning').value];
    document.getElementById('btnbinning').value = newtype;
    var checkb = document.getElementsByTagName("input");
    for(var i=0; i<checkb.length; i++)
    {
        if(checkb[i].type !== 'checkbox') continue;
     	if(!checkb[i].checked) continue;
        var da = checkb[i].id.replace("check_", "");
        // rectd3
        if(newtype >= 0 && newtype <= 3)
            d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', function(d) {
                if(d.x > xmin && d.x < xmax && d.y - d.systl < ymax && d.y + d.systh > ymin) { return shadowopacity; }
                else { return 0; }
            }).duration(transt);
        else
            d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', 0).duration(transt);

        // rectld3
        if(newtype >= 2 && newtype <= 5)
            d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('opacity', function(d) {
                if(d.x > xmin && d.x < xmax && d.y + d.systh > ymin && d.y - d.systl < ymax) { return 1; }
                else { return 0; }
            }).duration(transt);
        else
            d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('opacity', 0).duration(transt);            

        // rectvd3
        if(newtype >= 6 && newtype <= 9)
            d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('opacity', function(d) {
                if(d.xh > xmin && d.xl < xmax && d.y - d.systl < ymax && d.y + d.systh > ymin) { return shadowopacity; }
                else { return 0; }
            }).duration(transt);
        else
            d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('opacity', 0).duration(transt);

        // rectvld3
        if(newtype >= 8 && newtype <= 11)
            d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('opacity', function(d) {
                if(d.xh > xmin && d.xl < xmax && d.y - d.systl < ymax && d.y + d.systh > ymin) { return 1; }
                else { return 0; }
            }).duration(transt);
        else
            d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('opacity', 0).duration(transt);

        // linevd3
        if(newtype == 0 || (newtype >= 3 && newtype <= 4) || (newtype >= 7 && newtype <= 8) || newtype == 11)
            d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('opacity', function(d) {
                if(d.xh > xmin && d.xl < xmax && d.y < ymax && d.y > ymin) { return 1; }
                else { return 0; }
            }).duration(transt);
        else
            d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('opacity', 0).duration(transt);
    }
}

var gridopacity = function(transt=500) {
    var grid = d3.select("svg").select("g").selectAll('.grid');
    var next = {0 : 1, 1 : 0.5, 0.5 : 0.3, 0.3 : 0};
    var newopa = next[document.getElementById('btngrid').value];
    grid.transition().attr('opacity', newopa).duration(transt);
    document.getElementById('btngrid').value = newopa;
}

var addData = function(da, data, thecolor, kmarker, transt = 500) {

    // Narrow shadow
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
        .attr('fill', thecolor)
        .attr('stroke-width', 0)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y + d.systh > ymin && d.y - d.systl < ymax &&
               document.getElementById('btnbinning').value >= 0 && document.getElementById('btnbinning').value <= 3) { return shadowopacity; }
            else { return 0; }
        })
        .duration(transt);

    // Wide shadow
    var rectvs = d3.select("svg").select("g").selectAll('.rectvd3'+da)
        .data(data);
    rectvs.enter()
        .append('rect')
        .attr('class', 'rectvd3' + da)
        .merge(rectvs)
        .attr('x', function(d) {
            var xlow = x(d.xl);
            if(d.xl == d.x) xlow = x(d.x) - chartWidth/80.;
            return Math.max(0, xlow); })
        .attr('y', function(d) { return y(Math.min(d.y + d.systh, ymax)); })
        .attr('height', function(d) {
            if((d.y - d.systl) < ymax && (d.y + d.systh) > ymin)
                return y(Math.max(d.y - d.systl, ymin)) - y(Math.min(d.y + d.systh, ymax));
            else { return 0; }
        })
        .attr('width', function(d) {
            var xlow = x(d.xl);
            if(d.xl == d.x) xlow = x(d.x) - chartWidth/80.;
            if(xlow < 0) { xlow = 0; }
            var xhigh = x(d.xh);
            if(d.xh == d.x) xhigh = x(d.x) + chartWidth/80.;
            if(xhigh > chartWidth) { xhigh = chartWidth; }
            if(xhigh > xlow) { return (xhigh - xlow); }
            else { return 0; }})
        .attr('fill', thecolor)
        .attr('stroke-width', 0)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.xh > xmin && d.xl < xmax && d.y + d.systh > ymin && d.y - d.systl < ymax &&
               document.getElementById('btnbinning').value >= 6 && document.getElementById('btnbinning').value <= 9) { return shadowopacity; }
            else { return 0; }
        })
        .duration(transt);

    // Narrow outline
    var rectls = d3.select("svg").select("g").selectAll('.rectld3'+da)
        .data(data);
    rectls.enter()
        .append('rect')
        .attr('class', 'rectld3' + da)
        .merge(rectls)
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
        .attr('fill', 'transparent')
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.25)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y + d.systh > ymin && d.y - d.systl < ymax &&
               document.getElementById('btnbinning').value >= 2 && document.getElementById('btnbinning').value <= 5) { return 1; }
            else { return 0; }
        })
        .duration(transt);

    // Wide outline
    var rectvls = d3.select("svg").select("g").selectAll('.rectvld3'+da)
        .data(data);
    rectvls.enter()
        .append('rect')
        .attr('class', 'rectvld3' + da)
        .merge(rectvls)
        .attr('x', function(d) {
            var xlow = x(d.xl);
            if(d.xl == d.x) xlow = x(d.x) - chartWidth/80.;
            return Math.max(0, xlow); })
        .attr('y', function(d) { return y(Math.min(d.y + d.systh, ymax)); })
        .attr('height', function(d) {
            if((d.y - d.systl) < ymax && (d.y + d.systh) > ymin)
                return y(Math.max(d.y - d.systl, ymin)) - y(Math.min(d.y + d.systh, ymax));
            else { return 0; }
        })
        .attr('width', function(d) {
            var xlow = x(d.xl);
            if(d.xl == d.x) xlow = x(d.x) - chartWidth/80.;
            if(xlow < 0) { xlow = 0; }
            var xhigh = x(d.xh);
            if(d.xh == d.x) xhigh = x(d.x) + chartWidth/80.;
            if(xhigh > chartWidth) { xhigh = chartWidth; }
            if(xhigh > xlow) { return (xhigh - xlow); }
            else { return 0; }})
        .attr('fill', 'transparent')
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.25)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.xh > xmin && d.xl < xmax && d.y + d.systh > ymin && d.y - d.systl < ymax &&
               document.getElementById('btnbinning').value >= 8 && document.getElementById('btnbinning').value <= 11) { return 1; }
            else { return 0; }
        })
        .duration(transt);

    addDataLines(da, data, thecolor, transt);
    addDataPoints(da, data, thecolor, kmarker, transt);
}

var addDataLines = function(da, data, thecolor, transt = 500) {
    var kmarker = document.getElementById('marker_'+da).value;
    var delta = width/140.;
    // var delta = width/120.;
    // if(kmarker == 21 || kmarker == 25) delta = width/70./2.;
    // if(kmarker == 33 || kmarker == 27) delta = width/70./2.*1.4142;

    // Error line
    var lines = d3.select("svg").select("g").selectAll('.lined3'+da)
        .data(data);
    // --> error line 1
    lines.enter()
        .append('line')
        .attr('class', 'lined3' + da)
        .merge(lines)
        .attr('x1', function(d) { return xthrow(x(d.x)); })
        .attr('x2', function(d) { return xthrow(x(d.x)); })
        .attr('y1', function(d) { return yoverflow( y(d.y + d.stath) ); })
        .attr('y2', function(d) { return yoverflow( Math.max(y(d.y) - delta, y(d.y + d.stath)) ); })
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', 1)
        .duration(transt);
    // --> error line 2
    lines.enter()
        .append('line')
        .attr('class', 'lined3' + da)
        .merge(lines)
        .attr('x1', function(d) { return xthrow(x(d.x)); })
        .attr('x2', function(d) { return xthrow(x(d.x)); })
        .attr('y1', function(d) { return yoverflow( Math.min(y(d.y) + delta, y(d.y - d.statl)) ); })
        .attr('y2', function(d) { return yoverflow( y(d.y - d.statl) ); })
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', 1)
        .duration(transt);

    // Horizontal line
    var drawbinning = function() {
        if((document.getElementById('btnbinning').value == 0 ||
            (document.getElementById('btnbinning').value >= 3 && document.getElementById('btnbinning').value <= 4) ||
            (document.getElementById('btnbinning').value >= 7 && document.getElementById('btnbinning').value <= 8) ||
            document.getElementById('btnbinning').value == 11)) return 1;
        else return 0;
    }
    var linevs = d3.select("svg").select("g").selectAll('.linevd3'+da)
        .data(data);
    // --> horizontal line 1
    linevs.enter()
        .append('line')
        .attr('class', 'linevd3' + da)
        .merge(linevs)
        .attr('x1', function(d) { return xoverflow( x(d.xl) ); })
        .attr('x2', function(d) { return xoverflow( Math.max(x(d.x) - delta, x(d.xl)) ); })
        .attr('y1', function(d) { return ythrow(y(d.y)); })
        .attr('y2', function(d) { return ythrow(y(d.y)); })
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', drawbinning())
        .duration(transt);
    // --> horizontal line 2
    linevs.enter()
        .append('line')
        .attr('class', 'linevd3' + da)
        .merge(linevs)
        .attr('x1', function(d) { return xoverflow( Math.min(x(d.x) + delta, x(d.xh)) ); })
        .attr('x2', function(d) { return xoverflow( x(d.xh) ); })
        .attr('y1', function(d) { return ythrow(y(d.y)); })
        .attr('y2', function(d) { return ythrow(y(d.y)); })
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', drawbinning())
        .duration(transt);
}

var addDataPoints = function(da, data, thecolor, kmarker, transt = 500) {
    // Marker
    var points = d3.select("svg").select("g").selectAll('.pointd3'+da)
        .data(data);
    if(kmarker==20) { m20(da, points, thecolor, transt); }
    if(kmarker==21) { m21(da, points, thecolor, transt); }
    if(kmarker==24) { m24(da, points, thecolor, transt); }
    if(kmarker==25) { m25(da, points, thecolor, transt); }
    if(kmarker==33) { m33(da, points, thecolor, transt); }
    if(kmarker==27) { m27(da, points, thecolor, transt); }

};

var m20 = function(da, point, thecolor, transt = 500)
{
    var lsize = width/120.;
    point.enter()
        .append('circle')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('cx', function(d) { return x(d.x); })
        .attr('cy', function(d) { return y(d.y); })
        .attr('r', lsize)
        .attr('fill', thecolor)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        })
        .duration(transt);
};

var m24 = function(da, point, thecolor, transt = 500)
{
    var lsize = width/120./1.1;
    point.enter()
        .append('circle')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('cx', function(d) { return x(d.x); })
        .attr('cy', function(d) { return y(d.y); })
        .attr('r', lsize)
        .attr('fill', 'transparent')
        .attr('stroke', thecolor)
        .attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        })
        .duration(transt);
};

var m21 = function(da, point, thecolor, transt = 500)
{
    var lsize = width/70.;
    point.enter()
        .append('rect')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('x', function(d) { return x(d.x) - lsize/2.; })
        .attr('y', function(d) { return y(d.y) - lsize/2.; })
        .attr('width', lsize)
        .attr('height', lsize)
        .attr('fill', thecolor)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        })
        .duration(transt);
};

var m25 = function(da, point, thecolor, transt = 500)
{
    var lsize = width/70./1.1;
    point.enter()
        .append('rect')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('x', function(d) { return x(d.x) - lsize/2.; })
        .attr('y', function(d) { return y(d.y) - lsize/2.; })
        .attr('width', lsize)
        .attr('height', lsize)
        .attr('fill', 'transparent')
        .attr('stroke', thecolor)
	.attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        })
        .duration(transt);
};

var m33 = function(da, point, thecolor, transt = 500)
{
    var lsize = width/70./1.1;
    point.enter()
        .append('rect')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('x', function(d) { return x(d.x) - lsize/2.; })
        .attr('y', function(d) { return y(d.y) - lsize/2.; })
        .attr('width', lsize)
        .attr('height', lsize)
        .attr('transform', function(d) { return "rotate(45, "+x(d.x)+","+y(d.y)+")"; })
        .attr('fill', thecolor)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        })
        .duration(transt);
};

var m27 = function(da, point, thecolor, transt = 500)
{
    var lsize = width/70./1.1;
    point.enter()
        .append('rect')
        .attr('class', 'pointd3' + da)
        .merge( point )
        .attr('x', function(d) { return x(d.x) - lsize/2.; })
        .attr('y', function(d) { return y(d.y) - lsize/2.; })
        .attr('width', lsize)
        .attr('height', lsize)
        .attr('transform', function(d) { return "rotate(45, "+x(d.x)+","+y(d.y)+")"; })
        .attr('fill', 'transparent')
        .attr('stroke', thecolor)
	.attr('stroke-width', width/100.*0.27)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', function(d) {
            if(d.x > xmin && d.x < xmax && d.y > ymin && d.y < ymax) { return 1; }
            else { return 0; }
        })
        .duration(transt);
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
            addData(da, thisitem.data, document.getElementById('color_'+da).value, document.getElementById('marker_'+da).value, transt);
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
        d3.select("svg").select("g").selectAll('.rectld3'+da).remove();
        d3.select("svg").select("g").selectAll('.rectvd3'+da).remove();
        d3.select("svg").select("g").selectAll('.rectvld3'+da).remove();
        d3.select("svg").select("g").selectAll('.lined3'+da).remove();
        d3.select("svg").select("g").selectAll('.linevd3'+da).remove();
        d3.select("svg").select("g").selectAll('.pointd3'+da).remove();

        var thisitem = dataset[da];
        addData(da, thisitem.data, document.getElementById('color_'+da).value, document.getElementById('marker_'+da).value);
    }
    else
    {
        d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('opacity', 0).duration(transt);
        d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('opacity', 0).duration(transt);
    }

    addref();
}

function changeone(da, changemarker, transt = 500)
{
    if(document.getElementById('check_' + da).checked)
    {
        var mmarker = document.getElementById("marker_"+da).value;
        var cc = document.getElementById("color_"+da).value;

        d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('fill', cc).duration(transt);
        d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('stroke', cc).duration(transt);
        d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('fill', cc).duration(transt);
        d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('stroke', cc).duration(transt);
        d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('stroke', cc).duration(transt);
        d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('stroke', cc).duration(transt);

        if(changemarker==0)
        {
            if(mmarker==24 || mmarker==25 || mmarker==27)
                d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('stroke', cc).duration(transt);
            else
                d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('fill', cc).duration(transt);
        }
        else
        {
            d3.select("svg").select("g").selectAll('.pointd3'+da).remove();
            var thisitem = dataset[da];
            addDataPoints(da, thisitem.data, document.getElementById('color_'+da).value, document.getElementById('marker_'+da).value, transt);
        }
        
        relegend(da, transt);
    }
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
            changeone(da, 0, transt);
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
        d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('opacity', 0).duration(500);
        d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('opacity', 0).duration(500);
    }
    addref();

    d3.select("svg").selectAll('.legend').attr('opacity', 0).transition().duration(500);
    setTimeout(function() {
        d3.select("svg").selectAll('.legend').remove();
    }, 500);
    legs = [];
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

function legenditem(tlegend, thisitem, type=1)
{
    var type_legend = document.getElementById('btnlegend').value;

    // particle
    var rpa = parsescript(thisitem.particle);
    for(var p in rpa)
    {
        tlegend.append('tspan')
            .attr("class", rpa[p].cl)
            .style("font-weight", "bold")
            .text(decodehtml(rpa[p].content));
    }
    // collab
    tlegend.append('tspan')
        .text(' ' + thisitem.collab);
    // collision
    if(type_legend != 4)
    {
        tlegend.append('tspan')
            .style("font-style", "italic")
            .text(' ' + thisitem.collision + ' ' + thisitem.energy);
    }
    // kinea
    if(thisitem.kinea != "" && type_legend != 3)
    {
        var rpa = parsescript(thisitem.kinea);
        rpa[0].content = ", " + rpa[0].content;
        for(var p in rpa)
        {
            tlegend.append('tspan')
                .attr("class", rpa[p].cl)
                .text(decodehtml(rpa[p].content));
        }
    }
    // kineb
    if(thisitem.kineb != "" && type_legend != 2)
    {
        var rpa = parsescript(thisitem.kineb);
        rpa[0].content = ", " + rpa[0].content;
        for(var p in rpa)
        {
            tlegend.append('tspan')
                .attr("class", rpa[p].cl)
                .text(decodehtml(rpa[p].content));
        }
    }
}

function legend(da, trans = 500)
{
    var opa_legend = document.getElementById('btnlegend').value==0?0:1;
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
            .attr("dominant-baseline", "central")
            .attr("id", "legend_" + da)
            .attr('opacity', '0')
	    .style("text-anchor", "start");
        tlegend.append('tspan')
            .attr("class", "legendmark")
            .attr("id", "legendmark_" + da)
            .style("fill", document.getElementById('color_'+da).value)
            .text(decodehtml(voptlegend[document.getElementById('marker_'+da).value]+" "));
        legenditem(tlegend, thisitem);
        tlegend.transition().attr('opacity', opa_legend).duration(trans);
    }
}

function relegend(da, transt = 500) // change color
{
    var icheck = document.getElementById('check_' + da);
    // var ileg = d3.select('svg').select('#legend_' + da);
    if(icheck.checked)
    {
        d3.select("svg").select("#legendmark_"+da).transition()
            .style("fill", document.getElementById('color_'+da).value)
            .text(decodehtml(voptlegend[document.getElementById('marker_'+da).value]+" "))
            .duration(transt);
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
    var next = {1 : 2, 2 : 3, 3 : 4, 4 : 0, 0 : 1};
    var newtype = next[document.getElementById('btnlegend').value];
    document.getElementById('btnlegend').value = newtype;
    d3.select("svg").selectAll('.legend').remove();
    alllegend(0);
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

