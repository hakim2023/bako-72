// Single source for the menu: used by index.html (website) and menu.html (printable card).
// Dishes, prices and ingredients copied exactly from the restaurant's printed menu.
window.BAKO = {
  name: 'Bako-72',
  phones: [
    { label: '07 79 08 19 15', tel: '+33779081915' },
    { label: '09 80 83 03 14', tel: '+33980830314' },
  ],
  address: '6 rue Gaston Philipe, 93200 Saint-Denis',
  url: 'https://bako-72.netlify.app/',
  menu: [
    {
      id: 'mijotes',
      title: 'Plats mijotés',
      subtitle: 'Sauces & soupes traditionnelles',
      items: [
        { name: 'Thièb', price: 12, desc: 'Riz cassé une fois, oignons, ail, moutarde, poivre, poivrons, feuille de lauriers, persil, carottes, choux, cube Maggie, huile, cuisse de poulet / viande de bœuf.' },
        { name: 'Sauce Maffé', price: 12, desc: "Oignon, tomate, poivrons, ail, pâte de tomate, pâte d'arachide, cube Maggie, viande de bœuf, cuisse de poulet, poudre de crevettes." },
        { name: 'Sauce Yassa', price: 12, desc: 'Oignons, tomate, ail, huile, poivre, viande de bœuf, cuisse de poulet, olives, cube Maggie, moutarde.' },
        { name: 'Soupe Kandia', price: 12, desc: 'Oignons, tomate, ail, gombo frais, huile de palme, viande de bœuf, cube Maggie, sel.' },
        { name: 'Sauce Graine', price: 12, desc: 'Tomates fraîches, oignons, poivrons, viande de bœuf, Maggie, sel.' },
        { name: 'Sauce Feuilles', price: 12, desc: 'Feuilles de patates, gombo frais, huile de palme, oignon, tomate, ail, sel, Maggie, viande de bœuf.' },
        { name: 'Placali', price: 12, desc: 'Sauce graine, viande de bœuf, djoumblé, tomates, oignons, cube Maggie, sel.' },
        { name: 'Foutou Banane', price: 12, desc: 'Sauce graine, viande de bœuf, djoumblé, tomates, oignons, cube Maggie, sel.' },
        { name: 'Soupe de Poisson', price: 12, desc: 'Tomate fraîche et pâte de tomate, oignons, ail, cube Maggie, poivre noir, poisson tilapia, poudre de crevettes.' },
      ],
    },
    {
      id: 'grillades',
      title: 'Grillades & braisés',
      subtitle: 'Viandes marinées',
      items: [
        { name: 'Foie de Bœuf', price: 12, desc: 'Foie de bœuf, oignons, tomates, poivrons, poivre, ail, sel.' },
        { name: 'Ailes de Poulet', price: 12, desc: 'Marinade de poivre, moutarde, Maggie, persil, ail, ailes de poulet.' },
        { name: 'Choukouya de Mouton', price: 12, desc: 'Marinade : poivre, moutarde, Maggie, persil, viande de mouton.' },
        { name: 'Pintade Braisée', price: 12, desc: 'Marinade de poivre, moutarde, Maggie, persil, pintade.' },
      ],
    },
    {
      id: 'poissons',
      title: 'Poissons',
      subtitle: 'Attiéké, alloco & braisé',
      items: [
        { name: 'Garba', price: 12, desc: 'Oignon, tomate, piment, poisson thon frit, huile, cube Maggie, attiéké (semoule de manioc).' },
        { name: 'Attiéké Poisson Capitaine', price: 20, desc: 'Oignon, tomate, vinaigrette : vinaigre, Maggie, moutarde, huile.' },
        { name: 'Alloco Poisson Capitaine', price: 20, desc: '(Banane plantain) Oignon, tomate, vinaigrette : vinaigre, Maggie, moutarde, huile.' },
        { name: 'Poisson Braisé', price: 20, desc: 'Marinade (moutarde, persil, poivre, ail, Maggie, sel).' },
      ],
    },
    {
      id: 'boissons',
      title: 'Boissons',
      subtitle: 'Jus maison & fraîcheur',
      items: [
        { name: 'Jus de Bissap', price: 2.5, desc: '' },
        { name: 'Jus de Gingembre', price: 2.5, desc: '' },
        { name: 'Dègué', price: 2.5, desc: '' },
        { name: 'Canettes 33 cl', price: 1, desc: '' },
      ],
    },
  ],
}

window.formatPrice = (p) => (Number.isInteger(p) ? `${p}` : p.toFixed(2).replace('.', ',')) + ' €'
