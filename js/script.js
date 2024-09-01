document.addEventListener("DOMContentLoaded", () => {
  const previousButton = document.getElementById("previous");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const nextButton = document.getElementById("next");
  const shuffleButton = document.getElementById("shuffle");
  const playlistSongs = document.getElementById("playlist-songs");

  const audio = new Audio();
  const allSongs = [
    {
      id: 0,
      title: "Scratching The Surface",
      artist: "Quincy Larson",
      duration: "4:25",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
    },
    {
      id: 1,
      title: "Can't Stay Down",
      artist: "Quincy Larson",
      duration: "4:15",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
    },
    {
      id: 2,
      title: "Still Learning",
      artist: "Quincy Larson",
      duration: "3:51",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
    },
    {
      id: 3,
      title: "Cruising for a Musing",
      artist: "Quincy Larson",
      duration: "3:34",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
    },
    {
      id: 4,
      title: "Never Not Favored",
      artist: "Quincy Larson",
      duration: "3:35",
      src: "sound/never-not-favored.mp3",
    },
    {
      id: 5,
      title: "From the Ground Up",
      artist: "Quincy Larson",
      duration: "3:12",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
    },
    {
      id: 6,
      title: "Walking on Air",
      artist: "Quincy Larson",
      duration: "3:25",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
    },
    {
      id: 7,
      title: "Can't Stop Me. Can't Even Slow Me Down.",
      artist: "Quincy Larson",
      duration: "3:52",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
    },
    {
      id: 8,
      title: "The Surest Way Out is Through",
      artist: "Quincy Larson",
      duration: "3:10",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
    },
    {
      id: 9,
      title: "Chasing That Feeling",
      artist: "Quincy Larson",
      duration: "2:43",
      src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
    },
  ];

  let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0,
  };

  const playSong = (id) => {
    const song = userData.songs.find((song) => song.id === id);
    if (!song) return;

    audio.src = song.src;
    audio.currentTime = userData.songCurrentTime;
    userData.currentSong = song;
    playButton.classList.add("playing");
    audio.play();
    updatePlayerDisplay();
  };

  const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playButton.classList.remove("playing");
    audio.pause();
    updatePlayerDisplay();
  };

  const playPreviousSong = () => {
    if (!userData.currentSong) return;
    const currentIndex = userData.songs.indexOf(userData.currentSong);
    if (currentIndex > 0) playSong(userData.songs[currentIndex - 1].id);
  };

  const playNextSong = () => {
    if (!userData.currentSong) {
      playSong(userData.songs[0].id);
    } else {
      const currentIndex = userData.songs.indexOf(userData.currentSong);
      if (currentIndex < userData.songs.length - 1) {
        playSong(userData.songs[currentIndex + 1].id);
      }
    }
  };

  const shuffle = () => {
    userData.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    renderSongs(userData.songs);
    pauseSong();
    updatePlayerDisplay();
  };

  const deleteSong = (id) => {
    if (userData.currentSong?.id === id) {
      userData.currentSong = null;
      userData.songCurrentTime = 0;
      pauseSong();
    }
    userData.songs = userData.songs.filter((song) => song.id !== id);
    renderSongs(userData.songs);
    if (!userData.songs.length) resetPlaylist();
  };

  const updatePlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    playingSong.textContent = userData.currentSong?.title || "";
    songArtist.textContent = userData.currentSong?.artist || "";
  };

  const renderSongs = (songs) => {
    playlistSongs.innerHTML = songs
      .map(
        (song) => `
            <li id="song-${song.id}" class="playlist-song">
                <button class="playlist-song-info" data-id="${song.id}">
                    <span class="playlist-song-title">${song.title}</span>
                    <span class="playlist-song-artist">${song.artist}</span>
                    <span class="playlist-song-duration">${song.duration}</span>
                </button>
                <button class="playlist-song-delete" data-id="${song.id}" aria-label="Delete ${song.title}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </li>
        `
      )
      .join("");
  };

  const resetPlaylist = () => {
    userData.songs = [...allSongs];
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    renderSongs(userData.songs);
  };

  playlistSongs.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    const id = parseInt(target.dataset.id, 10);
    if (target.classList.contains("playlist-song-info")) {
      playSong(id);
    } else if (target.classList.contains("playlist-song-delete")) {
      deleteSong(id);
    }
  });

  previousButton.addEventListener("click", playPreviousSong);
  playButton.addEventListener("click", () =>
    userData.currentSong ? playSong() : playSong(userData.songs[0].id)
  );
  pauseButton.addEventListener("click", pauseSong);
  nextButton.addEventListener("click", playNextSong);
  shuffleButton.addEventListener("click", shuffle);

  resetPlaylist(); // Load initial playlist
});
