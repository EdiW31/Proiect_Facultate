//import de componente si librarii
import Navbar, { SidebarItem } from "../Navbar/navbar.component";
import ProgressCard from "../ProgressBarCard/progresscard.component";
import CurrencyConverter from "../CurrencySwap/currencyswap.component";
import MoneyChart from "../MoneyChart/moneychart.component";
import PieChart from "../MoneyChart/piechart.component";
import Typewriter from "../Mini-Components/hello.component";

import { Home, Plus, LogOut } from "lucide-react";
import { handleLogout } from "../Navbar/navbar.component";
import { useState, useEffect, useContext } from "react";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { UserContext } from "../../Contexts/loggedInContext";

const HomePage = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [cards, setCards] = useState([]); //folosim state pentru a tine minte cardurile
  const [createdCards, setCreatedCards] = useState(0); //folosim state pentru a tine minte cardurile create
  const [removedCards, setRemovedCards] = useState(0); //folosim state pentru a tine minte cardurile sterse
  const currentUser = useContext(UserContext); //folosim contextul pentru a tine minte userul curent

  useEffect(() => {
    if (currentUser) {
      const dbRef = ref(db, "cards/" + currentUser.uid);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data && Array.isArray(data)) {
          setCards(data);
        } else {
          setCards([]);
        }
      });

      const createdCardsRef = ref(db, "createdCards/" + currentUser.uid);
      onValue(createdCardsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCreatedCards(data);
        }
      });

      const removedCardsRef = ref(db, "removedCards/" + currentUser.uid);
      onValue(removedCardsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRemovedCards(data);
        }
      });
    }
  }, [currentUser, createdCards, removedCards]);

  //functie pentru a adauga un card nou
  const handleClick = () => {
    let limit = parseFloat(prompt("Enter the limit"));
    let name = prompt("Enter the name:");
    if (!limit || !name) return; //daca nu se introduce nimic, nu se adauga cardul

    const newCard = {
      limit: limit,
      name: name,
      money: 0,
    };

    setCards((prevCards) => [...prevCards, newCard]); //setam limita si numele din props si le punem in state

    //adaugam the new cards in state si data base
    const newCards = [...cards, newCard];
    const newCreatedCards = createdCards + 1; //incrementam numarul de carduri create
    setCards(newCards);
    if (currentUser) {
      set(ref(db, "cards/" + currentUser.uid), newCards);
      set(ref(db, "createdCards/" + currentUser.uid), newCreatedCards);
    }
    //incrementam numarul de carduri create
  };

  //functie pentru a sterge un card daca nu mai are nevoie de el
  const handleDelete = (index) => {
    //sterge cardul de la indexul respectiv
    const newCards = cards.filter((card, i) => i !== index);
    setCards(cards.filter((card, i) => i !== index));
    const newRemovedCards = removedCards + 1; //incrementam numarul de carduri sterse
    if (currentUser) {
      set(ref(db, "cards/" + currentUser.uid), newCards);
      set(ref(db, "removedCards/" + currentUser.uid), newRemovedCards);
    } //stergem cardul din database //incrementam numarul de carduri sterse
  };

  //functie pentru a updata cardul cu banii
  const updateCard = (cardId, newMoney) => {
    //redenumim index cu "cardId" ca sa fie mai clar
    const newCards = cards.map((card, index) => {
      if (index === cardId) {
        return { ...card, money: newMoney };
      } else {
        return card;
      }
    });
    setCards(newCards);
    set(ref(db, "cards/" + currentUser.uid), newCards); // use newCards direct din database pentru a nu se suprascrie cards
  };

  //returnam componentul
  return (
    <>
      <div className="flex bg-slate-50">
        {/* Sidebar Navigation care este sticky*/}
        <div className="sticky top-0 z-50">
          <Navbar>
            <SidebarItem icon={<Home size={20} />} text="Home" />
            <button onClick={handleClick}>
              <SidebarItem
                icon={<Plus size={20} />}
                text="Add New Card"
                active
              />
            </button>

            <hr className="my-2" />
            {/* Logout button */}
            <button onClick={handleLogout}>
              <SidebarItem icon={<LogOut size={20} />} text="Log Out" />
            </button>
          </Navbar>
        </div>
        {/* Sfarsitul navbarului*/}
        {/* Main Content*/}

        <div className="flex w-full flex-col align-items-center justify-items-centers">
          {currentUser ? (
            <Typewriter words={[`Welcome, ${currentUser.email}!`]} />
          ) : (
            <Typewriter words={["Welcome"]} />
          )}
          {/* Aici se afiseaza cardurile intr un dropdown pentru a simplifica pagina sa nu fie prea plina*/}
          <div className="flex md:hidden container justify-center items-center m-4 w-full ">
            <select
              className="bg-gradient-to-tr from-green-200 to-orange-300 text-black px-5 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedCard}
              onChange={(e) => setSelectedCard(Number(e.target.value))}
            >
              {cards.map((card, index) => (
                <option key={index} value={index}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>
          <div className="container md:mx-6 lg:mx-9 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 ">
            {cards.map((card, index) => (
              <div
                className={`col-span-1 ${
                  index === selectedCard ? "block" : "hidden md:block"
                }`}
              >
                <ProgressCard
                  key={index}
                  cardId={index}
                  limit={card.limit}
                  name={card.name}
                  uid={currentUser ? currentUser.uid : null}
                  money={card.money}
                  onDelete={() => handleDelete(index)}
                  updateCard={updateCard}
                />
              </div>
            ))}
          </div>
          <div className="container grid lg:mx-9 lg:my-6  grid-cols-1 lg:grid-cols-3 gap-4 align-items-center justify-items-center">
            <MoneyChart
              cards={cards}
              title="Istoric Cards Create/Sterse"
              description={
                "Here you can see as a PieChart how many cards you created v how many you deleted."
              }
            />
            <CurrencyConverter />
            <PieChart
              title="Istoric Cards Create/Sterse"
              description={
                "Here you can see as a PieChart how many cards you created v how many you deleted."
              }
              readedCards={createdCards}
              deletedCards={removedCards}
            />
          </div>
          <div className="grid w-auto my-2 lg:my-0 mx-4 lg:mx-9 h-4 bg-gradient-to-r from-emerald-300 via-yellow-200 via-pink-200 to-blue-200 rounded-lg"></div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
