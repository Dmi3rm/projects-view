export default {
  data () {
    return {
      culture: "en",
      cultRus_: "ru",
      cultEng_: "en",
      dictionary_: null,
    }
  },
  computed: {
    dictionary: function () {
      return this.dictionary_;
    }
  },
  methods: {
    setRus: function() {
      this.culture = this.cultRus_;
    },
    setEng: function() {
      this.culture = this.cultEng_;
    },
    tr: function(key) {
      if (this.dictionary == null || this.dictionary[key] == null) return "";
      if (this.culture === "en") {
        return this.dictionary[key].cen;
      } else if (this.culture === "ru") {
        return this.dictionary[key].cru;
      }
    },
    initDict: function(dict) {
      this.dictionary_ = dict;
    }
  },
}
