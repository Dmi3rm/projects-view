import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import math from 'mathjs';

//-Настройки платформы-
var renderer;
var scene;

function SetPerspectiveCamera(scale, graphCanvas) {
    scene.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.camera.position.y = 19 * parseFloat(scale);
    scene.camera.position.x = 30 * parseFloat(scale);
    scene.camera.position.z = 40 * parseFloat(scale);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
    UpdateControls(graphCanvas);
}

function SetOrthographicCamera(scale, graphCanvas) {
    scene.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    scene.camera.position.y = 5 * parseFloat(scale);
    scene.camera.position.x = 10 * parseFloat(scale);
    scene.camera.position.z = 15 * parseFloat(scale);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
    UpdateControls(graphCanvas);
}

function UpdateControls(graphCanvas) {
    scene.controls = new TrackballControls(scene.camera, graphCanvas);
    scene.controls.rotateSpeed = 3.0;
    scene.controls.zoomSpeed = 2.0;
    scene.controls.panSpeed = 1.0;
    scene.controls.noZoom = false;
    scene.controls.noPan = false;
    scene.controls.staticMoving = true;
    scene.controls.dynamicDampingFactor = 0.3;
}

var materialLine = new THREE.LineBasicMaterial({ color: 0xa3a3a3 });

function render() {
    requestAnimationFrame(render);
    scene.controls.update();
    renderer.render(scene, scene.camera);
};


//-Технические детали: рисование линий, сетки, осей, графиков-

function PaintCoordinates(scale, cellsNum, showCells) {
    PaintCylinder(0.2, 0.2, parseFloat(scale) * parseFloat(cellsNum) * 2.10, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, new THREE.MeshBasicMaterial({ color: 0x0000FF }));
    //PaintCylinder(0.2, 2, 10, { x: 0, y: 250, z: 0 }, { x: 0, y: 0, z: 0 }, new THREE.MeshBasicMaterial({ color: 0x0000FF }));
    PaintCylinder(0.2, 0.2, parseFloat(scale) * parseFloat(cellsNum) * 2.10, { x: 0, y: 0, z: 0 }, { x: Math.PI / 2, y: 0, z: 0 }, new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
    //PaintCylinder(0.2, 2, 10, { x: 0, y: 0, z: 250 }, { x: 0, y: 0, z: 0 }, new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
    PaintCylinder(0.2, 0.2, parseFloat(scale) * parseFloat(cellsNum) * 2.10, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: Math.PI / 2 }, new THREE.MeshBasicMaterial({ color: 0x00FF00 }));
    if (showCells == true) {
        PaintGrid(parseFloat(scale) * parseFloat(cellsNum), parseFloat(scale));
    }
}

function PaintGrid(Diapason, scale) {
    var x = -Diapason;
    var z = -Diapason;
    while (x < Diapason + 1) {
        PaintLine(x, 0, -Diapason, x, 0, Diapason, materialLine);
        x = x + scale;
    }

    var x = -Diapason;
    var z = -Diapason;
    while (z < Diapason + 1) {
        PaintLine(-Diapason, 0, z, Diapason, 0, z, materialLine);
        z = z + scale;
    }
}

function PaintLine(x1, y1, z1, x2, y2, z2, materialLine) {
    var geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
    );
    var line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);
}

function PaintGraph(Points, materialLine) {
    var geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(new THREE.Vector3(Points[0].x, Points[0].y, Points[0].z));
    for (var i = 1; i < Points.length - 1; i++) {
        geometryLine.vertices.push(new THREE.Vector3(Points[i].x, Points[i].y, Points[i].z));
        geometryLine.vertices.push(new THREE.Vector3(Points[i].x, Points[i].y, Points[i].z));
    }
    geometryLine.vertices.push(new THREE.Vector3(Points[Points.length - 1].x, Points[Points.length - 1].y, Points[Points.length - 1].z));
    var line = new THREE.Line(geometryLine, materialLine, THREE.LinePieces);
    scene.add(line);
}

function PaintCylinder(radiusBottom, radiusTop, height, position, rotation, mat) {
    var coin1_geo = new THREE.CylinderGeometry(radiusBottom, radiusTop, height, 50, 1, false);
    var coin1_mat = mat;
    var coin1 = new THREE.Mesh(coin1_geo, coin1_mat);
    coin1.position.set(position.x, position.y, position.z);
    coin1.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(coin1);
}


//-Вычисления-

//Считает значение функции с одним параметром. Передаем функцию и значение параметра
function CountCurrentValue(code, arg) {
    var scope = { t: arg };
    var result = code.eval(scope);
    return result;
}


function CountCurrentValue2(code, x0, y0, z0) {
    var scope = {
        x: x0, y: y0, z: z0
    };
    var result = code.eval(scope);
    return result;
}


function BuildGraph(Xfunc, Yfunc, Zfunc, Diapason, step, scale, color) {
    var t = -Diapason; var x1 = 0; var y1 = 0; var z1 = 0; var x2 = 0; var y2 = 0; var z2 = 0;
    var materialLine = new THREE.LineBasicMaterial({ color: color });
    var Points = [];

    var nodeX = math.parse(Xfunc);
    var codeX = nodeX.compile(math);
    x1 = CountCurrentValue(codeX, t);

    var nodeY = math.parse(Yfunc);
    var codeY = nodeY.compile(math);
    y1 = CountCurrentValue(codeY, t);

    var nodeZ = math.parse(Zfunc);
    var codeZ = nodeZ.compile(math);
    z1 = CountCurrentValue(codeZ, t);

    var point0 = { x: x1 * scale, y: y1 * scale, z: z1 * scale };
    Points.push(point0);

    while (t < Diapason) {
        t = t + step;
        x2 = CountCurrentValue(codeX, t);
        y2 = CountCurrentValue(codeY, t);
        z2 = CountCurrentValue(codeZ, t);
        var point = { x: x2 * scale, y: y2 * scale, z: z2 * scale };
        Points.push(point);
    }

    PaintGraph(Points, materialLine);
}


function BuildDifferentialEq(Xfunc, Yfunc, Zfunc, Diapason, step, scale, startpos, color) {
    var t = 0; var x1 = startpos.x; var y1 = startpos.y; var z1 = startpos.z; var x2 = 0; var y2 = 0; var z2 = 0;
    var materialLine = new THREE.LineBasicMaterial({ color: color });
    var Points1 = [];

    var point0 = { x: x1 * scale, y: y1 * scale, z: z1 * scale };
    Points1.push(point0);

    var nodeX = math.parse(Xfunc);
    var codeX = nodeX.compile(math);

    var nodeY = math.parse(Yfunc);
    var codeY = nodeY.compile(math);

    var nodeZ = math.parse(Zfunc);
    var codeZ = nodeZ.compile(math);

    while (t < Diapason) {
        t = t + step;
        x2 = x1 + step * CountCurrentValue2(codeX, x1, y1, z1);
        y2 = y1 + step * CountCurrentValue2(codeY, x1, y1, z1);
        z2 = z1 + step * CountCurrentValue2(codeZ, x1, y1, z1);
        var point = { x: x2 * scale, y: y2 * scale, z: z2 * scale };
        Points1.push(point);
        x1 = x2; y1 = y2; z1 = z2;
    }

    PaintGraph(Points1, materialLine);

    t = 0; x1 = startpos.x; y1 = startpos.y, z1 = startpos.z;
    var Points2 = [];
    var point0 = { x: x1 * scale, y: y1 * scale, z: z1 * scale };
    Points2.push(point0);

    while (t > -Diapason) {
        t = t - step;
        x2 = x1 - step * CountCurrentValue2(codeX, x1, y1, z1);
        y2 = y1 - step * CountCurrentValue2(codeY, x1, y1, z1);
        z2 = z1 - step * CountCurrentValue2(codeZ, x1, y1, z1);
        var point = { x: x2 * scale, y: y2 * scale, z: z2 * scale };
        Points2.push(point);
        x1 = x2; y1 = y2; z1 = z2;
    }

    PaintGraph(Points2, materialLine);
}





function GraphController(graphCanvas, graphField) {
    this.graphCanvas = graphCanvas;
    this.graphField = graphField;
    this.cameraType = true;

    //-Настройки платформы-
    renderer = new THREE.WebGLRenderer({ canvas: graphCanvas, antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(graphCanvas.offsetWidth, graphCanvas.offsetHeight);
    //graphField.appendChild(renderer.domElement);
    var materialLine = new THREE.LineBasicMaterial({ color: 0xa3a3a3 });
    scene = new THREE.Scene();
    this.SetCamera(5);
    render(this);

    PaintCoordinates(5, 30, true);
};

GraphController.prototype.SetCamera = function (scale, cameraType) {
    if (cameraType !== undefined) {
        this.cameraType = cameraType;
    }

    if (this.cameraType) {
        SetPerspectiveCamera(scale, this.graphCanvas);
    }
    else {
        SetOrthographicCamera(scale, this.graphCanvas);
    }
};

GraphController.prototype.BuildGraph = function (Xfunc, Yfunc, Zfunc, Diapason, step, scale, color) {
    BuildGraph(Xfunc, Yfunc, Zfunc, Diapason, step, scale, color);
};

GraphController.prototype.Clean = function (scale, cellsNum, showCells) {
    scene = new THREE.Scene();
    this.SetCamera(5);
    PaintCoordinates(scale, cellsNum, showCells);
};

GraphController.prototype.BuildDifferentialEq = function (Xfunc, Yfunc, Zfunc, Diapason, step, scale, startpos, color) {
    BuildDifferentialEq(Xfunc, Yfunc, Zfunc, Diapason, step, scale, startpos, color);
};

export default GraphController;
