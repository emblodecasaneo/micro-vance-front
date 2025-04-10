import{_ as F,c as i,b as e,x as D,d as R,w as A,g as H,y as w,z as C,n as c,F as T,l as O,t as o,D as U,N as Q,r,B as S,K as J,o as K,a as M,M as X,m as d}from"./index-CHW42hPp.js";const G={name:"RepaymentOverdueView",setup(){X();const{showToast:u}=Q(),t=r(!0),p=r([]),s=r(""),b=r(1),h=r(10),x=r(0),f=r(1),y=r(!1),n=r({}),g=r({payment_method:"cash",transaction_reference:"",penalty_amount:0}),_=r(!1),v=async()=>{t.value=!0;try{const a=await M.getOverdueRepayments({page:b.value,per_page:h.value});p.value=a.data.data.data,x.value=a.data.data.total,f.value=a.data.data.last_page}catch(a){console.error("Erreur lors du chargement des remboursements en retard:",a),u("Erreur lors du chargement des remboursements en retard.","error")}finally{t.value=!1}},V=S(()=>{if(!s.value)return p.value;const a=s.value.toLowerCase();return p.value.filter(l=>{const m=l.loan.client;if(!m)return!1;const k=`${m.first_name} ${m.last_name}`.toLowerCase(),P=(m.phone_number||"").toLowerCase();return k.includes(a)||P.includes(a)})});J(b,()=>{v()});const z=a=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"XAF"}).format(a||0),N=a=>{if(!a)return"N/A";const l=new Date(a);return new Intl.DateTimeFormat("fr-FR").format(l)},q=a=>{if(!a)return 0;const l=new Date,m=new Date(a),k=Math.abs(l-m);return Math.ceil(k/(1e3*60*60*24))},j=a=>{var l,m;return a?(((l=a.first_name)==null?void 0:l.charAt(0))||"")+(((m=a.last_name)==null?void 0:m.charAt(0))||""):"N/A"},B=a=>a?`${a.first_name||""} ${a.last_name||""}`.trim():"N/A",E=a=>{n.value=a,g.value={payment_method:"cash",transaction_reference:"",penalty_amount:Math.round(a.amount*.05*100)/100},y.value=!0},I=async()=>{_.value=!0;try{await M.recordRepayment(n.value.loan.id,n.value.id,g.value),u("Paiement enregistré avec succès.","success"),y.value=!1,v()}catch(a){console.error("Erreur lors de l'enregistrement du paiement:",a),u("Erreur lors de l'enregistrement du paiement.","error")}finally{_.value=!1}},L=async a=>{if(confirm("Êtes-vous sûr de vouloir marquer ce remboursement comme manqué ?"))try{t.value=!0,await M.missingRepayment(a.loan.id,a.id),u("Remboursement marqué comme manqué.","success"),v()}catch(l){console.error("Erreur lors du marquage du remboursement comme manqué:",l),u("Erreur lors du marquage du remboursement comme manqué.","error")}finally{t.value=!1}};return K(()=>{v()}),{loading:t,overdueRepayments:p,searchQuery:s,page:b,perPage:h,totalItems:x,lastPage:f,filteredRepayments:V,showPaymentModal:y,selectedRepayment:n,paymentData:g,paymentProcessing:_,formatCurrency:z,formatDate:N,getDaysLate:q,getInitials:j,getClientName:B,loadOverdueRepayments:v,openPaymentModal:E,recordPayment:I,markAsMissed:L}}},W={class:"flex justify-between items-center mb-4"},Y={class:"flex items-center"},Z={key:0,class:"flex justify-center py-6"},$={key:1,class:"bg-white rounded-lg shadow-sm p-6 text-center"},ee={key:2,class:"bg-white rounded-lg shadow-sm"},te={class:"p-4 border-b border-gray-200"},se={class:"flex flex-wrap items-center gap-3"},ne={class:"flex-grow min-w-[200px]"},ae={class:"overflow-x-auto"},oe={class:"min-w-full divide-y divide-gray-200"},re={class:"bg-white divide-y divide-gray-200"},le={class:"px-6 py-3 whitespace-nowrap"},ie={class:"flex items-center"},de={class:"h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-medium"},me={class:"ml-3"},ce={class:"text-xs font-medium text-gray-900"},ue={class:"text-xs text-gray-500"},ye={class:"px-6 py-3 whitespace-nowrap text-xs text-gray-500"},pe={class:"px-6 py-3 whitespace-nowrap text-xs text-gray-500"},xe={class:"px-6 py-3 whitespace-nowrap text-xs text-gray-500"},fe={class:"px-6 py-3 whitespace-nowrap"},ge={class:"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"},ve={class:"px-6 py-3 whitespace-nowrap text-right text-xs space-x-2"},be=["onClick"],we=["onClick"],he={class:"px-6 py-3 flex items-center justify-between border-t border-gray-200"},_e={class:"flex-1 flex justify-between sm:hidden"},ke=["disabled"],Ce=["disabled"],Me={class:"hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"},Pe={class:"text-xs text-gray-700"},De={class:"font-medium"},Re={class:"font-medium"},Ae={class:"font-medium"},Ve={class:"relative z-0 inline-flex rounded-md shadow-sm -space-x-px","aria-label":"Pagination"},ze=["disabled"],Ne=["disabled"],qe={key:3,class:"fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"},je={class:"relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"},Be={class:"space-y-4"},Ee={class:"bg-gray-50 p-3 rounded-md"},Ie={class:"grid grid-cols-2 gap-2 text-xs"},Le={class:"font-medium"},Fe={class:"font-medium"},He={class:"font-medium"},Te={class:"font-medium"},Oe={key:0},Ue={class:"mt-1 text-xs text-gray-500"},Qe={class:"text-sm font-semibold text-gray-900"},Se={class:"mt-6 flex justify-end space-x-2"},Je=["disabled"],Ke={key:0},Xe={key:1};function Ge(u,t,p,s,b,h){var f,y;const x=H("router-link");return d(),i("div",null,[e("div",W,[e("div",Y,[R(x,{to:"/loans",class:"text-primary hover:text-primary-dark flex items-center mr-3"},{default:A(()=>t[12]||(t[12]=[e("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-4 w-4 mr-1",viewBox:"0 0 20 20",fill:"currentColor"},[e("path",{"fill-rule":"evenodd",d:"M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z","clip-rule":"evenodd"})],-1)])),_:1}),t[13]||(t[13]=e("h1",{class:"text-sm font-medium text-gray-700"},"Remboursements en retard",-1))])]),s.loading?(d(),i("div",Z,t[14]||(t[14]=[e("svg",{class:"animate-spin h-5 w-5 text-primary",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},[e("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"}),e("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})],-1)]))):s.overdueRepayments.length===0?(d(),i("div",$,t[15]||(t[15]=[e("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-12 w-12 mx-auto text-gray-400 mb-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})],-1),e("h3",{class:"text-sm font-medium text-gray-900 mb-1"},"Aucun remboursement en retard",-1),e("p",{class:"text-xs text-gray-500"},"Tous les remboursements sont à jour.",-1)]))):(d(),i("div",ee,[e("div",te,[e("div",se,[e("div",ne,[w(e("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=n=>s.searchQuery=n),placeholder:"Rechercher un client...",class:"w-full text-xs rounded-md border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"},null,512),[[C,s.searchQuery]])]),e("button",{onClick:t[1]||(t[1]=(...n)=>s.loadOverdueRepayments&&s.loadOverdueRepayments(...n)),class:"btn btn-secondary flex items-center"},t[16]||(t[16]=[e("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-3.5 w-3.5 mr-1",viewBox:"0 0 20 20",fill:"currentColor"},[e("path",{"fill-rule":"evenodd",d:"M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z","clip-rule":"evenodd"})],-1),c(" Rafraîchir ")]))])]),e("div",ae,[e("table",oe,[t[17]||(t[17]=e("thead",{class:"bg-gray-50"},[e("tr",null,[e("th",{scope:"col",class:"px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"},"Client"),e("th",{scope:"col",class:"px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"},"Prêt ID"),e("th",{scope:"col",class:"px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"},"Montant"),e("th",{scope:"col",class:"px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"},"Date d'échéance"),e("th",{scope:"col",class:"px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"},"Jours de retard"),e("th",{scope:"col",class:"px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"},"Actions")])],-1)),e("tbody",re,[(d(!0),i(T,null,O(s.filteredRepayments,n=>(d(),i("tr",{key:n.id,class:"hover:bg-gray-50"},[e("td",le,[e("div",ie,[e("div",de,o(s.getInitials(n.loan.client)),1),e("div",me,[e("div",ce,o(s.getClientName(n.loan.client)),1),e("div",ue,o(n.loan.client.phone_number||"Pas de téléphone"),1)])])]),e("td",ye,[R(x,{to:`/loans/${n.loan.id}`,class:"text-primary hover:underline"},{default:A(()=>[c(" #"+o(n.loan.id),1)]),_:2},1032,["to"])]),e("td",pe,o(s.formatCurrency(n.amount)),1),e("td",xe,o(s.formatDate(n.due_date)),1),e("td",fe,[e("span",ge,o(s.getDaysLate(n.due_date))+" jours ",1)]),e("td",ve,[e("button",{onClick:g=>s.openPaymentModal(n),class:"btn btn-primary btn-xs"}," Payer ",8,be),e("button",{onClick:g=>s.markAsMissed(n),class:"btn btn-danger btn-xs"}," Marquer manqué ",8,we)])]))),128))])])]),e("div",he,[e("div",_e,[e("button",{onClick:t[2]||(t[2]=n=>s.page>1?s.page--:null),disabled:s.page<=1,class:"btn btn-secondary btn-sm"}," Précédent ",8,ke),e("button",{onClick:t[3]||(t[3]=n=>s.page<s.lastPage?s.page++:null),disabled:s.page>=s.lastPage,class:"btn btn-secondary btn-sm"}," Suivant ",8,Ce)]),e("div",Me,[e("div",null,[e("p",Pe,[t[18]||(t[18]=c(" Affichage de ")),e("span",De,o((s.page-1)*s.perPage+1),1),t[19]||(t[19]=c(" à ")),e("span",Re,o(Math.min(s.page*s.perPage,s.totalItems)),1),t[20]||(t[20]=c(" sur ")),e("span",Ae,o(s.totalItems),1),t[21]||(t[21]=c(" remboursements "))])]),e("div",null,[e("nav",Ve,[e("button",{onClick:t[4]||(t[4]=n=>s.page>1?s.page--:null),disabled:s.page<=1,class:"relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"},t[22]||(t[22]=[e("span",{class:"sr-only"},"Précédent",-1),e("svg",{class:"h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[e("path",{"fill-rule":"evenodd",d:"M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z","clip-rule":"evenodd"})],-1)]),8,ze),e("button",{onClick:t[5]||(t[5]=n=>s.page<s.lastPage?s.page++:null),disabled:s.page>=s.lastPage,class:"relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"},t[23]||(t[23]=[e("span",{class:"sr-only"},"Suivant",-1),e("svg",{class:"h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[e("path",{"fill-rule":"evenodd",d:"M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z","clip-rule":"evenodd"})],-1)]),8,Ne)])])])])])),s.showPaymentModal?(d(),i("div",qe,[e("div",{class:"fixed inset-0 bg-black opacity-50",onClick:t[6]||(t[6]=n=>s.showPaymentModal=!1)}),e("div",je,[t[35]||(t[35]=e("h3",{class:"text-sm font-semibold text-gray-900 mb-4"},"Enregistrer un paiement",-1)),e("div",Be,[e("div",null,[t[28]||(t[28]=e("label",{class:"block text-xs font-medium text-gray-700 mb-1"},"Détails du remboursement",-1)),e("div",Ee,[e("div",Ie,[e("div",null,[t[24]||(t[24]=e("span",{class:"text-gray-500"},"Client:",-1)),e("p",Le,o(s.getClientName((f=s.selectedRepayment.loan)==null?void 0:f.client)),1)]),e("div",null,[t[25]||(t[25]=e("span",{class:"text-gray-500"},"Prêt ID:",-1)),e("p",Fe,"#"+o((y=s.selectedRepayment.loan)==null?void 0:y.id),1)]),e("div",null,[t[26]||(t[26]=e("span",{class:"text-gray-500"},"Montant:",-1)),e("p",He,o(s.formatCurrency(s.selectedRepayment.amount)),1)]),e("div",null,[t[27]||(t[27]=e("span",{class:"text-gray-500"},"Date d'échéance:",-1)),e("p",Te,o(s.formatDate(s.selectedRepayment.due_date)),1)])])])]),e("div",null,[t[30]||(t[30]=e("label",{for:"payment_method",class:"block text-xs font-medium text-gray-700 mb-1"},"Méthode de paiement *",-1)),w(e("select",{id:"payment_method","onUpdate:modelValue":t[7]||(t[7]=n=>s.paymentData.payment_method=n),class:"block w-full text-xs rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"},t[29]||(t[29]=[e("option",{value:"cash"},"Espèces",-1),e("option",{value:"mobile_money"},"Mobile Money",-1),e("option",{value:"bank_transfer"},"Virement bancaire",-1)]),512),[[U,s.paymentData.payment_method]])]),s.paymentData.payment_method!=="cash"?(d(),i("div",Oe,[t[31]||(t[31]=e("label",{for:"transaction_reference",class:"block text-xs font-medium text-gray-700 mb-1"},"Référence de transaction",-1)),w(e("input",{id:"transaction_reference",type:"text","onUpdate:modelValue":t[8]||(t[8]=n=>s.paymentData.transaction_reference=n),class:"block w-full text-xs rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"},null,512),[[C,s.paymentData.transaction_reference]])])):D("",!0),e("div",null,[t[32]||(t[32]=e("label",{for:"penalty_amount",class:"block text-xs font-medium text-gray-700 mb-1"},"Montant de pénalité",-1)),w(e("input",{id:"penalty_amount",type:"number","onUpdate:modelValue":t[9]||(t[9]=n=>s.paymentData.penalty_amount=n),min:"0",step:"0.01",class:"block w-full text-xs rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary"},null,512),[[C,s.paymentData.penalty_amount,void 0,{number:!0}]]),e("p",Ue," Une pénalité de 5% ("+o(s.formatCurrency(s.selectedRepayment.amount*.05))+") est appliquée par défaut pour les paiements en retard. ",1)]),e("div",null,[t[33]||(t[33]=e("p",{class:"text-xs font-medium text-gray-700"},"Montant total à payer",-1)),e("p",Qe,o(s.formatCurrency(s.selectedRepayment.amount+s.paymentData.penalty_amount)),1)])]),e("div",Se,[e("button",{onClick:t[10]||(t[10]=n=>s.showPaymentModal=!1),class:"btn btn-secondary"}," Annuler "),e("button",{onClick:t[11]||(t[11]=(...n)=>s.recordPayment&&s.recordPayment(...n)),class:"btn btn-primary",disabled:s.paymentProcessing},[s.paymentProcessing?(d(),i("span",Ke,t[34]||(t[34]=[e("svg",{class:"animate-spin -ml-1 mr-2 h-3 w-3 text-white inline-block",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},[e("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"}),e("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})],-1),c(" Enregistrement... ")]))):(d(),i("span",Xe,"Enregistrer le paiement"))],8,Je)])])])):D("",!0)])}const Ye=F(G,[["render",Ge],["__scopeId","data-v-c5093116"]]);export{Ye as default};
