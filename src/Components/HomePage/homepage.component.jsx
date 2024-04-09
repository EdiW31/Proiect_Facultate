import Navbar, { SidebarItem } from "../Navbar/navbar.component";
import ProgressCard from "../ProgressBarCard/progresscard.component";
import { Home, Plus, LogOut } from "lucide-react";
import { handleLogout } from "../Navbar/navbar.component";
import { useState, useEffect, useContext } from "react";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { UserContext } from "../../Contexts/loggedInContext";
import CurrencyConverter from "../CurrencySwap/currencyswap.component";

const HomePage = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [cards, setCards] = useState([]); //folosim state pentru a tine minte cardurile
  const currentUser = useContext(UserContext); //folosim contextul pentru a tine minte userul curent

  useEffect(() => {
    if (currentUser) {
      // daca userul este logat luam cardurile din database pentru acel user
      const dbRef = ref(db, "cards/" + currentUser.uid);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCards(data ? data : []);
        }
      });
    }
  }, [currentUser]);

  //functie pentru a adauga un card nou
  const handleClick = () => {
    let limit = parseFloat(prompt("Enter the limit"));
    let name = prompt("Enter the name:");
    if (!limit || !name) return; //daca nu se introduce nimic, nu se adauga cardul

    const newCard = { limit: limit, name: name, money: 0 }; // Initialize money to 0

    setCards((prevCards) => [...prevCards, newCard]); //setam limita si numele din props si le punem in state

    //adaugam the new cards in state si data base
    const newCards = [...cards, newCard]; //newCards variabila diferita pentru a nu se suprascrie cards
    setCards(newCards);

    if (currentUser) {
      set(ref(db, "cards/" + currentUser.uid), newCards);
    }
  };

  //functie pentru a sterge un card daca nu mai are nevoie de el
  const handleDelete = (index) => {
    //sterge cardul de la indexul respectiv
    const newCards = cards.filter((card, i) => i !== index);
    setCards(cards.filter((card, i) => i !== index));
    if (currentUser) {
      set(ref(db, "cards/" + currentUser.uid), newCards);
    } //stergem cardul din database
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
      <div className="flex items-start bg-slate-50">
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
        <div className="flex flex-col">
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
          <div className="container mx-4 md:mx-6 lg:mx-9 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 items-stretch justify-items-stretch">
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
          <div className="container flex flex-col lg:flex-row justify-center items-center my-7 mx-4 md:mx-6 lg:mx-9">
            <CurrencyConverter />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
