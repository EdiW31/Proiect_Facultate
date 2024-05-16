import React, { useState, useEffect } from "react";

const Typewriter = ({ words }) => {
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWord, setCurrentWord] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentWord(words[i].substring(0, j));

      if (isDeleting) {
        setJ(j - 1);
        if (j === 0) {
          setIsDeleting(false);
          if (i < words.length - 1) {
            // Only increment 'i' if it's not the last word
            setI(i + 1);
          }
        }
      } else {
        setJ(j + 1);
        if (j === words[i].length) {
          setIsDeleting(false);
        }
      }
    }, 30); // adjust timing here

    return () => clearTimeout(timer); // clean up on unmount
  }, [i, j, isDeleting, words]);

  return (
    <div className="w-full flex justify-center lg:justify-normal items-center mt-7 mb-4 lg:ml-11">
      <h1 id="typewriter" className="text-1xl lg:text-3xl font-mono">
        {currentWord}
      </h1>
    </div>
  );
};

export default Typewriter;
