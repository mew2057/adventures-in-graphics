
var glCanvas  = null;
var gl = null; //ctx

// Between these bounds The code has its origin from https://developer.mozilla.org/en-US/docs/WebGL/Adding_2D_content_to_a_WebGL_context
//---------------------------------
function init()
{
    initGL();
    initProgram();
   // drawMDN();
    
    drawBase(loadJSON("cube.json"));
    //initBuffers();
   // drawScene();
    

}

function initGL()
{
    glCanvas = document.getElementById("gl-canvas");
    
    gl = glCanvas.getContext("webgl") || 
        glCanvas.getContext("experimental-webgl");
        
    if(!gl)
    {
        alert("Sorry but your context has no web gl support.");    
    }
    else
    {
        console.log("WebGL successfully loaded");    
    }        
    
}

function initProgram ()
{
    
    // Attaches the shader code defined in the DOM with the suppied id to th gl context.
    var vertexShader   = getShader(gl, "shader-vs");
    var fragmentShader = getShader(gl, "shader-fs");
    
    // Creates the shader program to actually run.
    var shaderProgram = gl.createProgram();         // Creates a new program with a factory in the context.
    gl.attachShader(shaderProgram, vertexShader);   // Attaches the vertex shader to the created program.
    gl.attachShader(shaderProgram, fragmentShader); // Attaches the fragment shader to the created program.
    gl.linkProgram(shaderProgram);                  // Attaches the program to the context.
    
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("program did not link");
    }
    
    gl.useProgram(shaderProgram);
   
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

}

// Source of this code: https://developer.mozilla.org/en-US/docs/WebGL/Adding_2D_content_to_a_WebGL_context
function getShader(ctx, id)
{
    var shaderScript, theSource, currentChild, shader;
   
    shaderScript = document.getElementById(id);
   
    if (!shaderScript) {
      return null;
    }
   
    theSource = "";
    currentChild = shaderScript.firstChild;
   
    while(currentChild) {
      if (currentChild.nodeType == currentChild.TEXT_NODE) {
        theSource += currentChild.textContent;
      }
     
      currentChild = currentChild.nextSibling;
    }
    
    // Checks 
    if (shaderScript.type == "x-shader/x-fragment") {
       shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
       shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
       // Unknown shader type
       return null;
    }
    
    gl.shaderSource(shader, theSource);
     
    // Compile the shader program
    gl.compileShader(shader);  
     
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
        return null;  
    }
     
    return shader;
}

// examples from MDN
function drawMDN()
{
     gl.clearColor(0, 155.4, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
}
// This doesn't work...
function drawBase(model)
{
    var VBO = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.verticies),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    var IBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(model.indicies),gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES,1, gl.UNSIGNED_BYTE, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);    
}
//---------------------------------

// My code

function loadJSON(fileName)
{
    return JSON.parse($.ajax({
        type    : "GET",
        url     : fileName,
        async: false
        
    }).responseText);
    
    console.log(model);
}