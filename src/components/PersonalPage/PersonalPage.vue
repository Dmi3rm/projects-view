<template>
  <div id="templateDiv">
    <main>
      <section id="aboutSection">
        <h2>{{tr("FIO")}}</h2>
      </section>

      <section id="projectSection">
        <div id="projectCont">
          <div class="projectItem" onclick="document.location.href = 'http://match3.dmi3y.ru'">
            <h4>Match 3</h4>
            <p>Match 3 Deluxe online</p>
          </div>
          <div class="projectItem" onclick="document.location.href = '3dgraphs'">
            <h4>{{tr("Graphs3D")}}</h4>
            <p>{{tr("Graphs3DDescr")}}</p>
          </div>
          <div class="projectItem" onclick="document.location.href = 'schemes.html'">
            <h4>{{tr("LogicSchemesName")}}</h4>
            <p>{{tr("LogicSchemesDescr")}}</p>
          </div>
          <div class="projectItem" onclick="document.location.href = 'rockets.html'">
            <h4>{{tr("GalaxyWarsName")}}</h4>
            <p>{{tr("GalaxyWarsDescr")}}</p>
          </div>
        </div>
        <div id="githubContainer">
          <p>
            {{tr("FindMoreGit")}}
            <a href="https://github.com/dmi3rm" class="alink">github.com</a>
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import dictionary_ from "./text.json";
import translationMixin from "../Utils/Translation/translationMixin";

export default {
  name: "PersonalPage",
  mixins: [translationMixin],
  data: function() {
    return {
      scrollY: 0
    };
  },
  methods: {
    handleScroll() {
      this.scrollY = document.body.scrollTop;
    }
  },
  mounted() {
    this.initDict(dictionary_);
  },
  created() {
    document.body.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    document.body.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style lang="scss" scoped>
@import "src/components/PersonalPage/PPCommonStyles.scss";
</style>

<style lang="scss" scoped>
@media (max-width: 850px) {
  @import "src/components/PersonalPage/PPSmallStyles.scss";
}
</style>

<style lang="scss" scoped>
@media (min-width: 851px) {
  @import "src/components/PersonalPage/PPLargeStyles.scss";
}
</style>
