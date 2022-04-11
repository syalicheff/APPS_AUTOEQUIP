var test =
[ 
  {
    REF: '0080280',
    DESIGNATIONS: undefined,
    DESIGNATIONMODIF: 'NON',
    FAMILLE: undefined,
    PRIXVENTE: 6.591,
    PRIXACHAT: '5,07',
    FOURNISSEUR: 'FASTCARPARTS',
    FRSPRINCIPAL: 0,
    PRIXFOURNISS:'5,07',
    VALEURREMISE: 0,
    BASEFAMILLE: 'NIS',
    MARQUE: 'NISSAN',
    GAMME: 'OE',
    COR1: '',
    COR2: undefined,
    COR3: undefined,
    COR4: undefined,
    COR5: undefined,
    COR6: undefined,
    COR7: undefined,
    COR8: undefined,
    COR9: undefined,
    COR10: undefined,
    PUBLIERSITE: 1,
    POIDSNET: undefined,
    CODEDOUANE: undefined,
    SUPARTICLE: 'NON'
  },
  {
    REF: '008030601P',
    DESIGNATIONS: undefined,
    DESIGNATIONMODIF: 'NON',
    FAMILLE: undefined,
    PRIXVENTE: 68.133,
    PRIXACHAT: '52,41',
    FOURNISSEUR: 'FASTCARPARTS',
    FRSPRINCIPAL: 0,
    PRIXFOURNISS: '52,41',
    VALEURREMISE: 0,
    BASEFAMILLE: 'NIS',
    MARQUE: 'NISSAN',
    GAMME: 'OE',
    COR1: '',
    COR2: undefined,
    COR3: undefined,
    COR4: undefined,
    COR5: undefined,
    COR6: undefined,
    COR7: undefined,
    COR8: undefined,
    COR9: undefined,
    COR10: undefined,
    PUBLIERSITE: 1,
    POIDSNET: undefined,
    CODEDOUANE: undefined,
    SUPARTICLE: 'NON'
  }
]
for (let i = 0; i < test.length; i++)
{
  if(typeof test[i].PRIXVENTE !=="undefined" ){
    //parseFloat('5.07'.replace(/,/, '.')
    if(typeof test[i].PRIXVENTE == "string"){test[i].PRIXVENTE=parseFloat(test[i].PRIXVENTE.replace(",","."))}
  }
  if(typeof test[i].PRIXACHAT !=="undefined"){
    if(typeof test[i].PRIXACHAT == "string"){test[i].PRIXACHAT=parseFloat(test[i].PRIXACHAT.replace(",","."))}
  }
  if(typeof test[i].PRIXFOURNISS !=="undefined"){
    if(typeof test[i].PRIXFOURNISS == "string"){test[i].PRIXFOURNISS=parseFloat(test[i].PRIXFOURNISS.replace(",","."))}
  }
  if(typeof test[i].DESIGNATIONS !=="undefined"){
    console.log(typeof test[i].DESIGNATIONS)
    test[i].DESIGNATIONS = test[i].DESIGNATIONS.slice(0,64).replace(/\t/g,'').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/,/g,'').replace('-','').replace("Rétroviseur","boitier").replace("rétroviseur","boitier").replace("Retroviseur","boitier").replace("retroviseur","boitier").replace("Rétro","boitier").replace("rétro","boitier").trim()
  }
  if (test[i].REF) {
      //console.log(test[i].DESIGNATIONS)
    test[i].REF = test[i].REF.replace(/\t/g,'').replace('-','').replace(/\s/g,'').replace(/[&\/\\#,+(-)$~%.'"Ø|:;=#*?<>{},]/g,'')
  }
}
console.log(test)

