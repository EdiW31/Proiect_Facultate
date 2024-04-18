import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../firebase/firebase";

//imagini pentru card
import bg1 from "../../assets/Background Card Images/IMG_3328.jpg";
import bg2 from "../../assets/Background Card Images/IMG_3327.jpg";
import bg3 from "../../assets/Background Card Images/IMG_3329.jpg";
import bg4 from "../../assets/Background Card Images/IMG_3330.jpg";
import bg5 from "../../assets/Background Card Images/IMG_3332.jpg";

const ProgressCard = (props) => {
  const [money, setMoney] = useState(props.money);
  const limit = props.limit; // ia limita din props
  const colors = [bg1, bg2, bg3, bg4, bg5]; // array cu backgroundImage pentru card
  const bgImage = colors[Math.floor(Math.random() * colors.length)]; // alegem o culoare random pentru card

  const cardRef = ref(db, "cards/" + props.uid + "/" + props.cardId); //referinta catre card

  //functie pentru a adauga bani in card
  const addMoney = () => {
    let amountToAdd = prompt("How much money do you want to add?"); //prompt pentru a adauga bani
    amountToAdd = parseInt(amountToAdd, 10); // convert the input to an integer

    // verificam daca este un integer
    if (!Number.isInteger(amountToAdd)) {
      alert("Please enter a valid number");
      return;
    }

    let newMoney = money + amountToAdd; //facem sa fie int   ca sa mearga calculat cu suma anterioara
    if (newMoney > limit) {
      //daca suma e mai mare decat limita setam money la limita
      newMoney = limit;
    }

    setMoney(newMoney);
    // setam cardData cu datele cardului
    const cardData = {
      uid: props?.uid,
      name: props?.name,
      limit: props?.limit,
      cardId: props?.cardId,
      money: newMoney,
    };

    // adaugam in database suma noua de bani
    set(cardRef, cardData)
      .then(() => {
        // daca se adauga cu succes bani in card se updateaza suma
        setMoney(newMoney);
        // se updateaza cardul in database cu suma noua de bani adaugata in card
        props.updateCard(props.cardId, newMoney);
      })
      .catch((error) => {
        // daca nu se adauga cu succes bani in card se afiseaza eroare
        console.error("Error updating money: ", error);
      });
  };

  const progressPercentage = (money / limit) * 100; // calculam bara de progres

  return (
    <div className="px-6 lg:px-0">
      <div
        className={`lg:mx-1.5 my-3 flex-col px-4 text-white font-bold shadow-md bg-clip-border rounded-xl w-auto bg-cover`}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="p-6">
          <h5 className="text-white block mb-2 font-sans text-xl antialiased font-bold leading-snug tracking-normal text-blue-gray-900">
            {props.name}
          </h5>
          <p className="block font-sans text-base antialiased font-light text-gray-600 leading-relaxed text-inherit">
            You have ${money}/${limit}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700 overflow-hidden">
          <div
            className="bg-yellow-400 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }} // setam width-ul la procentul calculat
          ></div>
        </div>
        <div className="p-6 pt-0">
          <button
            onClick={addMoney}
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 lg:py-3 lg:px-6 rounded-lg bg-neutral-300 text-gray-700 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
          >
            Add Money
          </button>
          <button
            onClick={props.onDelete} //stergem card ul si steam indexul celui anterior
            className="mx-1 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-3 lg:py-3 lg:px-5 rounded-lg bg-neutral-200 text-gray-700 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
