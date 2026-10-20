// Single source for the menu: used by index.html (website) and menu.html (printable card).
window.BAKO = {
  name: 'Bako-72',
  phones: [
    { label: '07 79 08 19 15', tel: '+33779081915' },
    { label: '09 80 83 03 14', tel: '+33980830314' },
  ],
  address: '6 rue Gaston Philipe, 93200 Saint-Denis',
  url: 'https://hakim2023.github.io/bako-72/',
  menu: [
    {
      id: 'mijotes',
      title: 'Plats mijotés',
      subtitle: 'Sauces & soupes traditionnelles',
      items: [
        { name: 'Thièb', price: 12, tag: 'Signature', desc: 'Riz cassé, carottes, choux, poivrons, oignons, ail, moutarde, laurier, persil. Cuisse de poulet ou viande de bœuf.' },
        { name: 'Sauce Maffé', price: 12, desc: "Sauce à la pâte d'arachide, tomate, poivrons, oignon, ail, poudre de crevettes. Viande de bœuf et cuisse de poulet." },
        { name: 'Sauce Yassa', price: 12, desc: 'Oignons fondants, moutarde, olives, tomate, ail, poivre. Viande de bœuf et cuisse de poulet.' },
        { name: 'Soupe Kandia', price: 12, desc: 'Gombo frais, huile de palme, tomate, oignons, ail. Viande de bœuf.' },
        { name: 'Sauce Graine', price: 12, desc: 'Tomates fraîches, oignons, poivrons. Viande de bœuf.' },
        { name: 'Sauce Feuilles', price: 12, desc: 'Feuilles de patates, gombo frais, huile de palme, tomate, oignon, ail. Viande de bœuf.' },
        { name: 'Placali', price: 12, desc: 'Servi avec sauce graine, viande de bœuf, djoumblé, tomates et oignons.' },
        { name: 'Foutou Banane', price: 12, desc: 'Servi avec sauce graine, viande de bœuf, djoumblé, tomates et oignons.' },
        { name: 'Soupe de Poisson', price: 12, desc: 'Poisson tilapia, tomate fraîche, oignons, ail, poivre noir, poudre de crevettes.' },
      ],
    },
    {
      id: 'grillades',
      title: 'Grillades & braisés',
      subtitle: 'Marinés et cuits à la braise',
      items: [
        { name: 'Foie de Bœuf', price: 12, desc: 'Foie de bœuf sauté, oignons, tomates, poivrons, ail, poivre.' },
        { name: 'Ailes de Poulet', price: 12, desc: 'Marinade poivre, moutarde, persil et ail.' },
        { name: 'Choukouya de Mouton', price: 12, tag: 'Coup de cœur', desc: 'Mouton mariné au poivre, moutarde et persil, grillé.' },
        { name: 'Pintade Braisée', price: 12, desc: 'Pintade marinée au poivre, moutarde et persil, braisée.' },
      ],
    },
    {
      id: 'poissons',
      title: 'Poissons',
      subtitle: 'Braisés ou frits, avec leurs accompagnements',
      items: [
        { name: 'Garba', price: 12, desc: 'Attiéké (semoule de manioc), thon frit, oignon, tomate, piment.' },
        { name: 'Attiéké Poisson Capitaine', price: 20, desc: 'Poisson capitaine, attiéké, oignon, tomate, vinaigrette maison à la moutarde.' },
        { name: 'Alloco Poisson Capitaine', price: 20, desc: 'Poisson capitaine, banane plantain frite, oignon, tomate, vinaigrette maison.' },
        { name: 'Poisson Braisé', price: 20, tag: 'Signature', desc: 'Mariné à la moutarde, persil, ail et poivre, cuit à la braise.' },
      ],
    },
    {
      id: 'boissons',
      title: 'Boissons',
      subtitle: 'Jus maison & fraîcheur',
      items: [
        { name: 'Jus de Bissap', price: 2.5, desc: "Infusion de fleurs d'hibiscus, servie bien fraîche." },
        { name: 'Jus de Gingembre', price: 2.5, desc: 'Gingembre frais, pressé maison.' },
        { name: 'Dégué', price: 2.5, desc: 'Dessert lacté au mil.' },
        { name: 'Canette 33 cl', price: 1, desc: 'Sodas au choix.' },
      ],
    },
  ],
}

window.formatPrice = (p) => (Number.isInteger(p) ? `${p}` : p.toFixed(2).replace('.', ',')) + ' €'
