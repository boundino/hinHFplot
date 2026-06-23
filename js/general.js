var obss = [
    { name: "RAA",         title: "RAA",            pymin: 0,     pymin_log: 0.1,  pymax: 1.5,  step: 0.05 },
    { name: "RpA",         title: "RpA",            pymin: 0,     pymin_log: 0.1,  pymax: 1.8,  step: 0.05 },
    { name: "RAB",         title: "RAB",            pymin: 0,     pymin_log: 0.1,  pymax: 1.5,  step: 0.05 },
    { name: "v1",          title: "v1",             pymin: -0.5,  pymin_log: 0.02, pymax: 0.5,  step: 0.05 },
    { name: "v2",          title: "v2",             pymin: -0.03, pymin_log: 0.02, pymax: 0.24, step: 0.01 },
    { name: "v3",          title: "v3",             pymin: -0.03, pymin_log: 0.02, pymax: 0.2,  step: 0.01 },
    { name: "vn",          title: "vn",             pymin: -0.03, pymin_log: 0.02, pymax: 0.24, step: 0.01 },
    { name: "LcToD0",      title: "&Lambda;c/D0",   pymin: 0,     pymin_log: 0.1,  pymax: 0.9,  step: 0.05 },
    { name: "DsubsToDplusmn",      title: "Ds/D+",   pymin: 0,     pymin_log: 0.2,  pymax: 1.1,  step: 0.05 },
    { name: "DsubsToD",      title: "Ds/D",   pymin: 0,     pymin_log: 0.1,  pymax: 1.1,  step: 0.05 },
    { name: "Ratio",       title: "Particle ratio", pymin: 0,     pymin_log: 0.15, pymax: 0.9,  step: 0.05 },
    { name: "DoubleRatio", title: "Double ratio",   pymin: 0,     pymin_log: 0.1,  pymax: 2,    step: 0.1 },
];

var vars = [
    { name: "pT",    title: "pT",         pxmin: 0,    pxmin_log: 1,   pxmax: 40,  step: 1 },
    { name: "y",     title: "y",          pxmin: -4.5, pxmin_log: 0.1, pxmax: 4.5, step: 0.1 },
    { name: "absy",  title: "|y|",        pxmin: 0,    pxmin_log: 0.1, pxmax: 4,   step: 0.1 },
    { name: "Npart", title: "Npart",      pxmin: 0,    pxmin_log: 7,   pxmax: 450, step: 10 },
    { name: "Ncoll", title: "Ncoll",      pxmin: 0,    pxmin_log: 1,   pxmax: 20, step: 10 },
    { name: "cent",  title: "Centrality", pxmin: 0,    pxmin_log: 4,   pxmax: 100, step: 5 },
];

function defaultrange()
{
    var iiobs = iobs(document.getElementById('observable').value),
        iivar = ivar(document.getElementById('xvariable').value);
    document.getElementById('pxmin').step = iivar.step;
    document.getElementById('pxmax').step = iivar.step;
    document.getElementById('pymin').step = iiobs.step;
    document.getElementById('pymax').step = iiobs.step;
}

function defaultvalue()
{
    var iiobs = iobs(document.getElementById('observable').value),
        iivar = ivar(document.getElementById('xvariable').value);
    document.getElementById('pxmin').value = iivar.pxmin;
    document.getElementById('pxmax').value = iivar.pxmax;
    document.getElementById('pymin').value = iiobs.pymin;
    document.getElementById('pymax').value = iiobs.pymax;
}

function loadoptions()
{
    for(var i=0; i<obss.length; i++) {
        var opt = document.createElement('option');
        opt.value = obss[i].name;
        opt.innerHTML = obss[i].title;
        if (obss[i].name === "v2") {
            opt.selected = true;
        }
        document.getElementById('observable').appendChild(opt);
    }
    for(var i=0; i<vars.length; i++) {
        var opt = document.createElement('option');
        opt.value = vars[i].name;
        opt.innerHTML = vars[i].title;
        document.getElementById('xvariable').appendChild(opt);
    }
    for(var i in plotpreset) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = plotpreset[i].title;
        if(i == " ") {
            opt.disabled = true;
            opt.selected = true;
        }
        document.getElementById('plotpreset').appendChild(opt);
    }
}

function decodehtml(str)
{
    var temp = document.createElement("p");
    temp.innerHTML = str;
    var result = temp.innerText;
    temp.remove();
    return result;
}

function unityzero()
{
    var obs = document.getElementById('observable').value;
    var vy = 0.0;
    if(obs == "RAA" || obs == "RpA" || obs == "RAB" || obs == "DoubleRatio") vy = 1.0;
    if(obs == "LcToD0") vy = 0.11;
    if(obs == "DsubsToDplusmn") vy = 0.5;
    return vy;
};

function iobs(name)
{
    var i=0;
    for(; i<obss.length; i++)
        if(obss[i].name === name)
            break;
    return obss[i];
}

function ivar(name)
{
    var i=0;
    for(; i<vars.length; i++)
        if(vars[i].name === name)
            break;
    return vars[i];
}

function switchbtn(id)
{
    document.getElementById(id).value = 1 - document.getElementById(id).value;
}

function colorbtn(id)
{
    var btnlog = document.getElementById(id);
    if(btnlog.classList.contains("btncheck")) {
        var classtoadd = btnlog.classList.contains("whitebkg") ? "bwactive" : "bactive";
        if(btnlog.value == 1) {
            btnlog.classList.add(classtoadd);
        } else {
            btnlog.classList.remove(classtoadd);
        }
    }
}

function savename()
{
    var savename = document.getElementById('savenameinput').value;
    savename = savename==""?"hinHFplot":savename;
    return savename;
}

