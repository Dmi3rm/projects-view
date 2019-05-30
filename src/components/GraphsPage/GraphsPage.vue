<template>
  <div id="templateDiv">
    <div class="nav" id="nav">
      <span class="sidenavPoint" v-on:click="setNav"><i class="fa fa-bars"></i></span>
      <span id="mobHeaderSpan">{{tr("Graphs3D")}}</span>
      <a href="#helpModal" data-toggle="modal" id="About"><i class="fa fa fa-question"></i></a>
      <a href="/" id="close"><i class="fa fa-times"></i></a>
    </div>

    <div id="commonTemplate">
      <section id="Menu" :class="{'menuOn':showNav, 'menuOff': !showNav}">
        <section id="compHeader">
          <span id="headText" class="fittext">{{tr("Graphs3D")}}</span>
          <a href="#helpModal" data-toggle="modal" id="About"><i class="fa fa fa-question"></i></a>
          <a href="/" id="close"><i class="fa fa-times"></i></a>
        </section>
        <section id="FuncGraph">
          <div id="FuncGraphHeadDiv">
            <font id="FuncGraphHeadFont">{{tr("FuncGraphHeader")}}</font>
          </div>
          <div id="FuncGraphFunctions">
            <div>
              <label style="background: #00FF00">x(t)</label>
              <input id="Xfunc" :value="Xfunc"/>
            </div>
            <div>
              <label style="background: #519efc">y(t)</label>
              <input id="Yfunc" :value="Yfunc" />
            </div>
            <div>
              <label style="background:#ff4848">z(t)</label>
              <input id="Zfunc" :value="Zfunc" />
            </div>
          </div>
          <button v-on:click="" id="FuncGraphBtn" v-on:click="buildFuncGraph">{{tr("Draw")}}</button>
        </section>

        <section id="EqGraph">
          <div id="EqGraphHeadDiv">
            <font id="EqGraphHeadFont">{{tr("EqGraphHeader")}}</font>
          </div>
          <div id="EqGraphFunctions">
            <div>
              <label style="background: #00FF00;">x'</label>
              <input id="Xeq" :value="Xeq" />
            </div>
            <div>
              <label style="background: #519efc;">y'</label>
              <input id="Yeq" :value="Yeq" />
            </div>
            <div>
              <label style="background: #ff4848;">z'</label>
              <input id="Zeq" :value="Zeq" />
            </div>
          </div>

          <div id="EqGraphValues">
            <div>
              <label style="background: #00FF00;">x0</label>
              <input id="Xpoint" type="number" :value="Xpoint" />
            </div>
            <div>
              <label style="background: #519efc;">y0</label>
              <input id="Ypoint" type="number" :value="Ypoint" />
            </div>
            <div>
              <label style="background: #ff4848;">z0</label>
              <input id="Zpoint" type="number" :value="Zpoint" />
            </div>
          </div>
          <button id="EqGraphBtn" v-on:click="buildEqGraph">{{tr("Draw")}}</button>
          <button id="EqRandomBtn" v-on:click="buildEqGraph3">{{tr("Draw")}} 3</button>
        </section>

        <button id="Clean" v-on:click="cleanGraph">{{tr("Clean")}}</button>

        <section id="Parameters">
          <div id="ParametersHeadDiv">
            <font id="ParametersFont">{{tr("Params")}}</font>
          </div>
          <div id="paramsBtnContDiv">
            <button id="FieldParameters" v-on:click="setGraphOrFieldParamsVis(false)" :style="{color: !showGraphOrFieldVis ? 'grey' : 'black' }">{{tr("Field")}}</button>
            <button id="GraphParameters" v-on:click="setGraphOrFieldParamsVis(true)" :style="{color: showGraphOrFieldVis ? 'grey' : 'black' }">{{tr("Graph")}}</button>
          </div>
          <table id="FieldSettings" v-if="!showGraphOrFieldVis">
            <tr>
              <td><label>{{tr("Scale")}}&nbsp(px)&nbsp</label></td>
              <td><input id="ScaleInput" type="number" :value="scale" /></td>
            </tr>
            <tr>
              <td><label>{{tr("Cells")}}&nbsp</label></td>
              <td><input id="CellInput" type="number" :value="cellsNum" /></td>
            </tr>
            <tr>
              <td><label>{{tr("Grid")}}</label></td>
              <td>
                <button id="TurnOffGridBtn" v-on:click="setOnOffGridBtnVis(true)" v-if="!showOnOffGridBtn">{{tr("Hide")}}</button>
                <button id="TurnOnGridBtn" v-on:click="setOnOffGridBtnVis(false)" v-if="showOnOffGridBtn">{{tr("Show")}}</button>
              </td>
            </tr>
            <tr>
              <td><label>{{tr("Camera")}}</label></td>
              <td>
                <div class="cameraTypeContDiv">
                  <input type="radio" v-model="perspectiveCamera" value="true" name="cam" id="PerspectiveRadio"/>
                  <label>{{tr("Perspective")}}</label>
                </div>
                <div class="cameraTypeContDiv">
                  <input type="radio" v-model="perspectiveCamera" value="false" name="cam" id="OrthographicRadio"/>
                  <label>{{tr("Orthogonal")}}</label>
                </div>
              </td>
            </tr>
          </table>

          <table id="GraphSettings" v-if="showGraphOrFieldVis">
            <tr>
              <td><label>{{tr("Range")}}</label></td>
              <td><input id="DiapasonInput" type="number" :value="diapason" /></td>
            </tr>
            <tr>
              <td><label>{{tr("Step")}}</label></td>
              <td><input id="StepInput" type="number" :value="step" /></td>
            </tr>
            <tr>
              <td><label>{{tr("GraphColor")}}</label></td>
              <td><input type="color" id="ColorPicker" v-model="color"/></td>
            </tr>
          </table>
        </section>
      </section>

      <section id="GraphField">
        <div id="canvasHover" :style="{display: showNav ? 'block' : 'none'}" v-on:click="setNav"></div>
        <canvas id="GraphCanvas"></canvas>
      </section>
    </div>

    <div class="modal fade" id="helpModal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{tr("Graphs3D")}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="max-height:400px; overflow-y:auto;">
            <p>{{tr("HelpP1")}}</p>
            <p>{{tr("HelpP2")}}</p>
            <p>
              {{tr("HelpP3A1")}}<br />
              {{tr("HelpP3A2")}}</br>
              {{tr("HelpP3A3")}}
            </p>
          </div>
          <div class="modal-footer">
            <span>{{tr("TimeStamp")}}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<style lang="scss" scoped>
@import 'src/components/GraphsPage/GPCommonStyles.scss';
</style>

<style lang="scss" scoped>
@media (max-width:850px) {
  @import 'src/components/GraphsPage/GPSmallStyles.scss';
}
</style>

<style lang="scss" scoped>
@media (min-width:851px) {
  @import 'src/components/GraphsPage/GPLargeStyles.scss';
}
</style>

<style scoped>
@import 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css';
</style>


<script>
import GraphController from './GraphController';
import dictionary_ from './text.json';
import translationMixin from '../Utils/Translation/translationMixin';
import 'font-awesome/css/font-awesome.min.css';
import '../Utils/Modal/modal.js';
import $ from 'jquery';


export default {
  name: 'GraphsPage',
  mixins: [translationMixin],
  data: () => {
    return {
      graphController: null,

      showNav: false,
      showCells: true,
      showGraphOrFieldVis: false,
      showOnOffGridBtn: true,

      Xfunc: "t*cos(t)",
      Yfunc: "t*sin(t)",
      Zfunc: "t",

      Xeq: "x+3*y",
      Yeq: "-6*x-5*y",
      Zeq: "z+x",

      Xpoint: 1,
      Ypoint: 1,
      Zpoint: 0,

      scale: 5,
      cellsNum: 30,
      step: 0.01,
      diapason: 30,
      color: "#000000",

      perspectiveCamera: true,
    };
  },
  computed: {

  },
  watch: {
    perspectiveCamera: function(val) {
      let cameraType = (val === "true");
      this.graphController.SetCamera(this.scale, cameraType);
    }
  },
  methods: {
    setNav() {
      this.showNav = !this.showNav;
    },
    setGraphOrFieldParamsVis(graphVis) {
      this.showGraphOrFieldVis = graphVis;
    },
    setOnOffGridBtnVis(onVis) {
      this.showOnOffGridBtn = onVis;
      this.showCells = !onVis;
    },
    buildFuncGraph() {
      this.graphController.BuildGraph(this.Xfunc, this.Yfunc, this.Zfunc, this.diapason, this.step, this.scale, this.color);
    },
    buildEqGraph() {
      let X0 = parseFloat(this.Xpoint);
      let Y0 = parseFloat(this.Ypoint);
      let Z0 = parseFloat(this.Zpoint);
      this.graphController.BuildDifferentialEq(this.Xeq, this.Yeq, this.Zeq, this.diapason, this.step, this.scale, {x: X0, y: Y0, z: Z0}, this.color);
    },
    buildEqGraph3 () {
      for (let i = 0; i < 3; i ++)
      {
        this.Xpoint += i;
        this.Ypoint += i;
        this.Zpoint += i;

        this.graphController.BuildDifferentialEq(this.Xeq, this.Yeq, this.Zeq, this.diapason, this.step, this.scale,
          {x: this.Xpoint, y: this.Ypoint, z: this.Zpoint}, this.color);
        }
      },
      cleanGraph() {
        this.graphController.Clean(this.scale, this.cellsNum, this.showCells);
      }
    },
    mounted() {
      this.initDict(dictionary_);
      this.graphController = new GraphController(document.getElementById("GraphCanvas"), document.getElementById("GraphField"));
      let templateHeight = document.getElementById("templateDiv").offsetHeight;
      let navHeight = document.getElementById("nav").offsetHeight;
      let menu = $("#Menu");
      menu.height(templateHeight - navHeight);
    }
  };
</script>

<style lang="scss" scoped>
@import 'src/components/GraphsPage/GPCommonStyles.scss';
</style>

<style lang="scss" scoped>
@media (max-width:850px) {
  @import 'src/components/GraphsPage/GPSmallStyles.scss';
}
</style>

<style lang="scss" scoped>
@media (min-width:851px) {
  @import 'src/components/GraphsPage/GPLargeStyles.scss';
}
</style>

<style scoped>
@import 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css';
</style>
