import * as Tone from "tone";
import {
  piano_sampler,
  kick_sampler,
  hihat_sampler,
  snare_sampler,
} from "./samples";

// generates random number falling in the range (min, max) (inclusive)
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// starting the audio context
export const startAudioContext = async () => {
  await Tone.start();
  Tone.getTransport().start();
  console.log("Audio Context Started");
};

// keys with their corresponding semitone values from C
const keys = {
  C: 0,
  Cs: 1,
  D: 2,
  Ds: 3,
  E: 4,
  F: 5,
  Fs: 6,
  G: 7,
  Gs: 8,
  A: 9,
  As: 10,
  B: 11,
};

// mapping key indices to key names
const keyIndices = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// chord types by their interval patterns
const chords = {
  major_triad: [0, 4, 7], // major triad
  minor_triad: [0, 3, 7], // minor triad
  major_7th: [0, 4, 7, 11], // major 7th
  minor_7th: [0, 3, 7, 10], // minor 7th
};

// function to map the key values to key names (0->C4)
function getKeyName(keyValue, octave = 4) {
  const keyIndex = keyValue % 12;
  let keyName = keyIndices[keyIndex];
  return keyName + octave; // returns "C4, D4, F#4, etc"
}

// function to generate a chord progression based on the key specified
function generateProgression(keyOffset = 0, octave = 4) {
  let progressionType = generateRandomNumber(0, 2);
  let progression = [];

  // all progressions defined in relative terms to the key
  switch (progressionType) {
    case 0: // I-V-vi-IV (major key)
      console.log("I-V-vi-IV progression chosen");

      progression = [
        { root: (0 + keyOffset) % 12, chord: chords.major_triad }, // I  (C in C major)
        { root: (7 + keyOffset) % 12, chord: chords.major_triad }, // V  (G in C major)
        { root: (9 + keyOffset) % 12, chord: chords.minor_triad }, // vi (A minor in C major)
        { root: (5 + keyOffset) % 12, chord: chords.major_triad }, // IV (F in C major)
      ];
      break;

    case 1: // vi-IV-I-V (major key)
      console.log("vi-IV-I-V progression chosen");

      progression = [
        { root: (9 + keyOffset) % 12, chord: chords.minor_triad }, // vi (A in C major)
        { root: (5 + keyOffset) % 12, chord: chords.major_triad }, // IV (F in C major)
        { root: (0 + keyOffset) % 12, chord: chords.major_triad }, // I  (C in C major)
        { root: (7 + keyOffset) % 12, chord: chords.major_triad }, // V  (G in C major)
      ];
      break;

    case 2: // i-VI-III-VII (minor key)
      console.log("i-VI-III-VII progression chosen");

      progression = [
        { root: (0 + keyOffset) % 12, chord: chords.minor_triad }, // i   (C in C minor)
        { root: (8 + keyOffset) % 12, chord: chords.major_triad }, // VI  (Ab in C minor)
        { root: (3 + keyOffset) % 12, chord: chords.major_triad }, // III (Eb in C minor)
        { root: (10 + keyOffset) % 12, chord: chords.major_triad }, // VII (Bb in C minor)
      ];
      break;
  }

  return progression.map((chordObj) =>
    chordObj.chord.map((interval) => {
      const noteValue = (chordObj.root + interval) % 12; // calculating the note value
      return getKeyName(noteValue, octave); // converting it to a note name
    })
  );
}

export function setup() {
  const key = generateRandomNumber(0, 11);
  console.log(`Random key selected: ${keyIndices[key]}`);
  const progression = generateProgression(key, generateRandomNumber(3, 3));
  console.log("Generated progression:", progression);

  const bpm = generateRandomNumber(70, 90);

  console.log("BPM", bpm);

  initInstruments();
  initSeq(progression);
  playSequence(bpm);
}

const initInstruments = () => {
  const highPassFilter = new Tone.Filter(20000, "highpass").toDestination(); // connecting the filter to the audio output
  piano_sampler.connect(highPassFilter);

  piano_sampler.toDestination();

  kick_sampler.toDestination();

  hihat_sampler.toDestination();

  snare_sampler.toDestination();
};

// =================================================================================================
// Sequences
const initSeq = (chord_progression) => {
  setPianoChordsSeq(chord_progression);
  setKickSeq();
  setHihatSeq();
  setSnareSeq();
};

let piano_chords_seq;
const setPianoChordsSeq = (chord_progression) => {
  piano_chords_seq = new Tone.Sequence(
    (time, id) => {
      console.log(chord_progression[id]);
      piano_sampler.triggerAttackRelease(chord_progression[id], "1n", time);
    },
    [0, 1, 2, 3],
    "1m"
  );
};

let kick_seq;
const setKickSeq = () => {
  kick_seq = new Tone.Sequence(
    (time, id) => {
      if (id != null) {
        kick_sampler.triggerAttackRelease("C1", "8n", time);
      }
    },
    [1, null, null, null, 1, 1, null, 1, 1, null, null, null, 1, 1, null, 1],
    "8n"
  );
};

let hihat_seq;
const setHihatSeq = () => {
  hihat_seq = new Tone.Sequence(
    (time, id) => {
      if (id != null) {
        hihat_sampler.triggerAttackRelease("C1", "8n", time);
      }
    },
    [1, null, 1, null, 1, null, 1, 1, 1, null, 1, null, 1, null, 1, 1],
    "8n"
  );
};

let snare_seq;
const setSnareSeq = () => {
  snare_seq = new Tone.Sequence(
    (time, id) => {
      if (id != null) {
        snare_sampler.triggerAttackRelease("C1", "8n", time);
      }
    },
    [
      null,
      null,
      1,
      null,
      null,
      null,
      1,
      1,
      null,
      null,
      1,
      null,
      null,
      null,
      1,
      1,
    ],
    "8n"
  );
};
// =================================================================================================

// Playing the sequence
const playSequence = (bpm) => {
  Tone.getTransport().bpm.value = bpm;

  Tone.getTransport().start();
  piano_chords_seq.start();
  kick_seq.start();
  hihat_seq.start();
  snare_seq.start();
};

// stopping the sequence (song)
export const stopSequence = () => {
  piano_chords_seq.stop();
  kick_seq.stop();
  hihat_seq.stop();
  snare_seq.stop();
};
