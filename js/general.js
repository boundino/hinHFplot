
function defaultrange()
{
    var drange =
        {
            "LcToD0+absy"    : { pxmin : 0   , pxmax : 4   , pymin : 0     , pymax : 0.9 }  ,
            "LcToD0+cent"    : { pxmin : 0   , pxmax : 100 , pymin : 0     , pymax : 0.9 }  ,
            "LcToD0+Npart"   : { pxmin : 0   , pxmax : 450 , pymin : 0     , pymax : 0.9 }  ,
            "LcToD0+pT"      : { pxmin : 0   , pxmax : 22  , pymin : 0     , pymax : 0.9 }  ,
            "LcToD0+y"       : { pxmin : -4  , pxmax : 4   , pymin : 0     , pymax : 0.9 }  ,

            "RAA+absy"     : { pxmin : 0   , pxmax : 4   , pymin : 0     , pymax : 1.3 }  ,
            "RAA+cent"     : { pxmin : 0   , pxmax : 100 , pymin : 0     , pymax : 1.3 }  ,
            "RAA+Npart"    : { pxmin : 0   , pxmax : 450 , pymin : 0     , pymax : 1.3 }  ,
            "RAA+pT"       : { pxmin : 0.1 , pxmax : 50  , pymin : 0     , pymax : 1.3 }  ,
            "RAA+y"        : { pxmin : -4  , pxmax : 4   , pymin : 0     , pymax : 1.3 }  ,

            "RpA+absy"     : { pxmin : 0   , pxmax : 4   , pymin : 0.2   , pymax : 1.8 }  ,
            "RpA+cent"     : { pxmin : 0   , pxmax : 100 , pymin : 0.2   , pymax : 1.8 }  ,
            "RpA+Npart"    : { pxmin : 0   , pxmax : 450 , pymin : 0.2   , pymax : 1.8 }  ,
            "RpA+pT"       : { pxmin : 0.1 , pxmax : 50  , pymin : 0.2   , pymax : 1.8 }  ,
            "RpA+y"        : { pxmin : -4  , pxmax : 4   , pymin : 0.2   , pymax : 1.8 }  ,

            "RpARAA+absy"  : { pxmin : 0   , pxmax : 4   , pymin : 0     , pymax : 1.3 }  ,
            "RpARAA+cent"  : { pxmin : 0   , pxmax : 100 , pymin : 0     , pymax : 1.3 }  ,
            "RpARAA+Npart" : { pxmin : 0   , pxmax : 450 , pymin : 0     , pymax : 1.3 }  ,
            "RpARAA+pT"    : { pxmin : 0.1 , pxmax : 50  , pymin : 0     , pymax : 1.3 }  ,
            "RpARAA+y"     : { pxmin : -4  , pxmax : 4   , pymin : 0     , pymax : 1.3 }  ,

            "v2+absy"      : { pxmin : 0   , pxmax : 4   , pymin : -0.03 , pymax : 0.24 } ,
            "v2+cent"      : { pxmin : 0   , pxmax : 100 , pymin : -0.03 , pymax : 0.24 } ,
            "v2+Npart"     : { pxmin : 0   , pxmax : 450 , pymin : -0.03 , pymax : 0.24 } ,
            "v2+pT"        : { pxmin : 0   , pxmax : 40  , pymin : -0.03 , pymax : 0.24 } ,
            "v2+y"         : { pxmin : -4  , pxmax : 4   , pymin : -0.03 , pymax : 0.24 } ,

            "v3+absy"      : { pxmin : 0   , pxmax : 4   , pymin : -0.03 , pymax : 0.1 }  ,
            "v3+cent"      : { pxmin : 0   , pxmax : 100 , pymin : -0.03 , pymax : 0.1 }  ,
            "v3+Npart"     : { pxmin : 0   , pxmax : 450 , pymin : -0.03 , pymax : 0.1 }  ,
            "v3+pT"        : { pxmin : 0   , pxmax : 40  , pymin : -0.03 , pymax : 0.1 }  ,
            "v3+y"         : { pxmin : -4  , pxmax : 4   , pymin : -0.03 , pymax : 0.1 }  ,

            "vn+absy"      : { pxmin : 0   , pxmax : 4   , pymin : -0.03 , pymax : 0.24 } ,
            "vn+cent"      : { pxmin : 0   , pxmax : 100 , pymin : -0.03 , pymax : 0.24 } ,
            "vn+Npart"     : { pxmin : 0   , pxmax : 450 , pymin : -0.03 , pymax : 0.24 } ,
            "vn+pT"        : { pxmin : 0   , pxmax : 40  , pymin : -0.03 , pymax : 0.24 } ,
            "vn+y"         : { pxmin : -4  , pxmax : 4   , pymin : -0.03 , pymax : 0.24 } ,
        }

    var varkey = document.getElementById('observable').value + "+" + document.getElementById('xvariable').value;
    document.getElementById('pxmin').value = drange[varkey].pxmin;
    document.getElementById('pxmax').value = drange[varkey].pxmax;
    document.getElementById('pymin').value = drange[varkey].pymin;
    document.getElementById('pymax').value = drange[varkey].pymax;
}

function decodehtml(str)
{
    var temp = document.createElement("p");
    temp.innerHTML = str;
    var result = temp.innerText;
    temp.remove();
    return result;
}
