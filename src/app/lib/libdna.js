// @ts-check

const dnaNucleotides = ['A', 'T', 'C', 'G'];
const rnaNucleotides = ['A', 'U', 'C', 'G'];

const STOP_SYMBOL = "$";

/**
  * $ sign represents stop
  * FROM(https://rosalind.info/glossary/rna-codon-table/)
  */
const codonTable = {
  UUU: 'F', CUU: 'L', AUU: 'I', GUU: 'V',
  UUC: 'F', CUC: 'L', AUC: 'I', GUC: 'V',
  UUA: 'L', CUA: 'L', AUA: 'I', GUA: 'V',
  UUG: 'L', CUG: 'L', AUG: 'M', GUG: 'V',
  UCU: 'S', CCU: 'P', ACU: 'T', GCU: 'A',
  UCC: 'S', CCC: 'P', ACC: 'T', GCC: 'A',
  UCA: 'S', CCA: 'P', ACA: 'T', GCA: 'A',
  UCG: 'S', CCG: 'P', ACG: 'T', GCG: 'A',
  UAU: 'Y', CAU: 'H', AAU: 'N', GAU: 'D',
  UAC: 'Y', CAC: 'H', AAC: 'N', GAC: 'D',
  UAA: '$', CAA: 'Q', AAA: 'K', GAA: 'E',
  UAG: '$', CAG: 'Q', AAG: 'K', GAG: 'E',
  UGU: 'C', CGU: 'R', AGU: 'S', GGU: 'G',
  UGC: 'C', CGC: 'R', AGC: 'S', GGC: 'G',
  UGA: '$', CGA: 'R', AGA: 'R', GGA: 'G',
  UGG: 'W', CGG: 'R', AGG: 'R', GGG: 'G'
};

/**
  * @typedef {string & { readonly '': unique symbol } } dnaString
  * @description valid dna string with only atcg nucleotides
  */

/**
  * @typedef {string & { readonly '': unique symbol } } rnaString
  * @description valid dna string with only aucg nucleotides
  */

/**
  * @typedef {string & { readonly '': unique symbol } } proteinString
  * @description valid protein string with only the 20 aminoacids 
  */

/**
  * @typedef { { description: string, sequence: string  | rnaString | dnaString | proteinString }[] } fastaObj
  */


/**
  * TODO(luatil): Implement the FASTA format from: https://www.ncbi.nlm.nih.gov/genbank/fastaformat/#:~:text=In%20FASTA%20format%20the%20line,should%20not%20contain%20any%20spaces.
  */

/**
  * @param {string} fastaString
  * @returns {fastaObj} 
  */
function parseFastaFormat(fastaString) {
  const result = fastaString
    .split('>')
    .splice(1)
    .map((el) => {
      const record = el.split("\n").slice(0, -1);
      const seq = record.splice(1).join("");
      return {
        description: record[0],
        sequence: seq,
      }
    })
  return result;
}

/**
  * @param {rnaString} rnaSequence
  * @returns {proteinString} 
  */
function RNAtoProtein(rnaSequence) {
  const aminoAcids = [];

  for (let i = 0; i < rnaSequence.length; i += 3) {
    const codon = rnaSequence.slice(i, i + 3);
    const aminoAcid = codonTable[codon];
    if (aminoAcid === STOP_SYMBOL) {
      break;
    }
    aminoAcids.push(aminoAcid);
  }

  // @ts-expect-error (conversion to protein string)
  return aminoAcids.join("");
}

/**
  * @param {dnaString} seqA 
  * @param {dnaString} seqB
  * @returns {number} - The hamming distance between A and B
  */
function hammingDistance(seqA, seqB) {

  let count = 0;

  for (let i = 0; i < Math.min(seqA.length, seqB.length); i++) {
    count += (seqA[i] !== seqB[i]) ? 1 : 0;
  }

  return count;
}

/**
  * @param {dnaString} dnaSequence
  * @returns {number} - GC Content of the dna sequence 
  * @description GC content is the percentage of the 
  * dna sequence such that is either a G or a C
  */
function getContentGC(dnaSequence) {
  const countGC = Array.from(dnaSequence)
    .filter((nucleotide) => ['G', 'C'].includes(nucleotide))
    .length;
  return (countGC / dnaSequence.length) * 100;
}

/**
  * @param {dnaString} dnaSequence
  * @returns {dnaString} - reversed sequence complement 
  */
function sequenceToReverseComplement(dnaSequence) {
  const complementMap = {
    'A': 'T',
    'C': 'G',
    'T': 'A',
    'G': 'C'
  }

  // @ts-expect-error (complementation function works)
  return Array.from(dnaSequence).reverse().map((el) => complementMap[el]).join("");
}

/**
  * @param {dnaString} dnaSequence
  * @returns {string}
  */
function formatWithReversedComplement(dnaSequence) {
  // TODO(luatil): Do a better version of this
  const reversedComplement = Array.from(sequenceToReverseComplement(dnaSequence)).reverse().join("");
  const upSlashes = new Array(dnaSequence.length).fill("|").join("");
  const result = [
    "5\' ",
    dnaSequence,
    " 3\'\n",
    '   ',
    upSlashes,
    "\n3\' ",
    reversedComplement,
    " 5\'\n",
  ].join("");
  return result;
}

/**
  * @param {dnaString} dnaSequence
  * @returns {rnaString}
  */
function transcribeDNAtoRNA(dnaSequence) {
  // @ts-expect-error (translation function works)
  return Array.from(dnaSequence).map((el) => el === 'T' ? 'U' : el).join("");
}

/**
  * @param {string} dnaSequence
  * @returns {dnaString?}
  */
function validateDNA(dnaSequence) {
  for (let el of dnaSequence) {
    if (!(dnaNucleotides.includes(el))) {
      return null;
    }
  }
  // @ts-expect-error (the above does the validation)
  return dnaSequence;
}

/**
  * @param {string} rnaSequence 
  * @returns {rnaString?}
  */
function validateRNA(rnaSequence) {
  for (let el of rnaSequence) {
    if (!(rnaNucleotides.includes(el))) {
      return null;
    }
  }
  // @ts-expect-error (the above does the validation)
  return rnaSequence;
}

/**
  * @param {number} sequenceLength
  * @returns {dnaString}
  */
function generateRandomDNASequence(sequenceLength) {

  const sequence = [];

  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(dnaNucleotides[randomInt(0, 3)]);
  }

  // @ts-expect-error (string generation is able to produce valid dna string) 
  return sequence.join("");
}

/**
  * @param {dnaString} dnaSequence 
  * @returns {{ 'A': number, 'T': number, 'C': number, 'G': number}}
  */
function countNucleotideFrequency(dnaSequence) {

  const nucleotideCounter = {
    'A': 0,
    'T': 0,
    'C': 0,
    'G': 0
  }

  Array.from(dnaSequence).forEach((nucleotide) => {
    nucleotideCounter[nucleotide] += 1;
  });

  return nucleotideCounter;
}

/**
  * @param {number} start
  * @param {number} end
  * @returns {number}
  */
function randomInt(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

module.exports = {
  validateDNA,
  validateRNA,
  generateRandomDNASequence,
  countNucleotideFrequency,
  randomInt,
  transcribeDNAtoRNA,
  sequenceToReverseComplement,
  formatWithReversedComplement,
  getContentGC,
  hammingDistance,
  RNAtoProtein,
  parseFastaFormat
};
