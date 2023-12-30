const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Attention",
      singer: "Vicetone",
      path: "./music/Attention.mp3",
      image: "./img/anh-nen-dep-ve-que-huong_025848404.jpg",
    },
    {
      name: "Death Bed",
      singer: "jack",
      path: "./music/Death_Bed.mp3",
      image: "./img/hinh-anh-lang-que-viet-nam-6.jpg",
    },
    {
      name: "Legends Never Die",
      singer: "MTP",
      path: "./music/Legends_Never_Die.mp3",
      image: "./img/hinh-nen-que-huong-tuyet-dep_025901137.jpg",
    },
    {
      name: "Let Me Down Slowly",
      singer: "Karik",
      path: "./music/Let_Me_Down_Slowly.mp3",
      image: "./img/Hinh-nen-que-huong.jpg",
    },
    {
      name: "Payphone",
      singer: "Suboi",
      path: "./music/Payphone.mp3",
      image: "./img/anh-nen-dep-ve-que-huong_025848404.jpg",
    },
    {
      name: "Rather Be",
      singer: "Messi",
      path: "./music/Rather_Be.mp3",
      image: "./img/hinh-nen-que-huong-tuyet-dep_025901137.jpg",
    },
    {
      name: "We dont talk anymore",
      singer: "Messi",
      path: "./music/We_dont_talk_anymore.mp3",
      image: "./img/Hinh-nen-que-huong.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index==this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option js-option-${index}"" data-index="${index}" >
              <i class="fas fa-ellipsis-h"></i>
              <div class="option-container hide btn-group-vertical" >
                <button class="btn btn-primary option-item option-item1-${index}" type="button">
                  <i class="bi bi-cloud-arrow-down-fill"></i>
                </button>
                <button class="btn btn-primary option-item option-item2-${index}" type="button">
                  <i class="bi bi-trash"></i>
                </button>
                </div>
            </div>
            </div>
            `;
    });
    playList.innerHTML = htmls.join("");
  },
  //end render

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {

    // Xử lí CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ],{
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause();

    //xử lí phóng to / thu nhỏ CD
    const CdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = CdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / CdWidth;
      // Render songs / Scroll top
    };

    // xử lí khi click play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song được play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song được pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;
      }
    };

    // Xử lí khi tua bài hát
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    };

    // xử lí khi next bài hát
    nextBtn.onclick = function(){
      if(app.isRandom){
        app.playRandomSong()
      }else{
        app.nextSong()
      }
      audio.play()
      app.render()
      app.scrollToActiveSong()
    }

    // xử lí khi prev bài hát
    prevBtn.onclick = function() {
      if(app.isRandom){
        app.playRandomSong()
      }else{
        app.prevSong()
      }
      audio.play()
      app.render()
      app.scrollToActiveSong()
    }

    // xử lí khi random bài hát
    randomBtn.onclick = function() {
      app.isRandom = !app.isRandom
      randomBtn.classList.toggle('active', app.isRandom)
    }

    // xử lí khi repeat bài hát
    repeatBtn.onclick = function() {
      app.isRepeat = !app.isRepeat
      repeatBtn.classList.toggle('active', app.isRepeat)
    }

    // xử lí next song khi audio ended
    audio.onended = function() {
      if(app.isRepeat){
        audio.play()
      }else{
        nextBtn.click()
      }
    }

    // lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      const optionNode = e.target.closest('.option')
      if( songNode || optionNode){
        // xử lí khi click vào song
        if(songNode && !e.target.closest('.option')){
          app.currentIndex = songNode.dataset.index
          app.loadCurrentSong()
          app.render()
          audio.play()
        }
        // xử lí khi click vào option
        if(optionNode){
          // console.log(optionNode.dataset.index);
          const dataOption = optionNode.dataset.index
          const optionContainer = $(`.js-option-${dataOption} .option-container`);
          // console.log(optionContainer);
          optionContainer.classList.toggle('hide')
          const remove = e.target.closest(`.option-item2-${dataOption}`)
          if(remove){
            let indexRemove = dataOption
            // console.log(indexRemove);
            if (!isNaN(indexRemove)) {
              let a = app.songs.splice(indexRemove, 1);
              // console.log(a);
              app.saveToStorage();
              location.reload();
          }
          }
          
        }
      }
    }

    


  },

  
  scrollToActiveSong: function() {
    let block
    if(this.currentIndex < 3 ){
      block = 'center'
    }else{
      block = 'nearest'
    }
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: block,
      })
    }, 300)
  },

  //lưu các giá trị vào local
  saveToStorage: function () {
    localStorage.setItem('songs', JSON.stringify(this.songs));
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function() {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function() {
    this.currentIndex--
    console.log(this.currentIndex,this.songs.length)
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong()
  },

  playRandomSong: function() {
    let newIndex
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  //end handleEvents
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.handleEvents();

    // Lắng nghe / xử lý các sự kiện  (DOM events)
    this.defineProperties();

    // Tải thông tin bài đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // render playlist
    this.render();
  },
};
app.start();
