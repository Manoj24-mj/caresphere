/* Shared illustrative records for the standalone client-demonstration pages. */
window.CareSphereDemo = {
  bedTypes: ["General", "ICU", "Emergency", "Pediatric", "Maternity", "Isolation"],
  hospitals: [
    {id:"district-general",name:"District General Hospital",type:"Government hospital",location:"Central District",distance:2.4,updated:"5 minutes ago",status:"Available",phone:"+91 80 5550 0100",beds:{General:[18,50],ICU:[3,12],Emergency:[2,6],Pediatric:[4,10],Maternity:[5,12],Isolation:[1,4]}},
    {id:"city-medical",name:"City Medical Centre",type:"Public teaching hospital",location:"North District",distance:5.1,updated:"12 minutes ago",status:"Limited",phone:"+91 80 5550 0200",beds:{General:[9,40],ICU:[2,10],Emergency:[1,5],Pediatric:[3,8],Maternity:[2,10],Isolation:[0,3]}},
    {id:"community-care",name:"Community Care Hospital",type:"Community health centre",location:"East District",distance:7.8,updated:"8 minutes ago",status:"Available",phone:"+91 80 5550 0300",beds:{General:[22,35],ICU:[0,0],Emergency:[2,4],Pediatric:[2,6],Maternity:[3,6],Isolation:[1,2]}}
  ],
  medicines: [
    {id:"paracetamol",name:"Paracetamol",strength:"500 mg",availability:"Available",quantity:"128 tablets",provider:"District General Hospital Pharmacy",providerType:"Hospital pharmacy",location:"Central District",distance:2.4,updated:"10 minutes ago"},
    {id:"metformin",name:"Metformin",strength:"500 mg",availability:"Limited",quantity:"12 strips",provider:"Jan Aushadhi Kendra",providerType:"Government pharmacy",location:"Central District",distance:3.2,updated:"18 minutes ago"},
    {id:"amoxicillin",name:"Amoxicillin",strength:"250 mg",availability:"Unavailable",quantity:"Currently unavailable",provider:"City Medical Centre Pharmacy",providerType:"Hospital pharmacy",location:"North District",distance:5.1,updated:"45 minutes ago"},
    {id:"saline",name:"Normal saline",strength:"0.9% · 500 ml",availability:"Available",quantity:"36 bottles",provider:"Care Supply Network",providerType:"Authorized supplier",location:"East District",distance:6.7,updated:"22 minutes ago"}
  ],
  ambulances: [
    {id:"KA-01-AB-1234",type:"Advanced Life Support",distance:1.8,eta:6,status:"Available"},
    {id:"KA-01-XY-4820",type:"Basic Life Support",distance:3.4,eta:11,status:"Limited"},
    {id:"KA-02-CD-9021",type:"Patient Transport",distance:5.2,eta:16,status:"Unavailable"}
  ],
  blood: [
    {group:"O+",facility:"District General Hospital Blood Bank",location:"Central District",distance:2.4,status:"Available",units:12,updated:"14 minutes ago"},
    {group:"A+",facility:"City Medical Centre Blood Bank",location:"North District",distance:5.1,status:"Limited",units:2,updated:"28 minutes ago"},
    {group:"O−",facility:"Community Care Hospital Blood Bank",location:"East District",distance:7.8,status:"Unknown",units:null,updated:"Availability not reported"}
  ],
  doctors: [
    {name:"Dr. Priya Sharma",specialty:"Cardiology",facility:"District General Hospital",distance:2.4,status:"Appointments available"},
    {name:"Dr. Kiran Rao",specialty:"General medicine",facility:"City Medical Centre",distance:5.1,status:"Limited appointments"},
    {name:"Dr. Ananya Iyer",specialty:"Pediatrics",facility:"Community Care Hospital",distance:7.8,status:"Availability not confirmed"}
  ],
  schemes: [
    {id:"pmjay",name:"Ayushman Bharat · PM-JAY",description:"Hospital treatment coverage for eligible families at participating hospitals.",eligibility:"Eligibility depends on official beneficiary records and current programme rules.",benefits:["Hospital treatment support","Cashless eligible care","Empanelled hospitals"],how:"Check beneficiary status through the official PM-JAY channel or an authorized help desk.",contact:"Official PM-JAY helpline: 14555. Verify current details through official sources."},
    {id:"janasanjeevani",name:"Jan Aushadhi medicines",description:"Access quality generic medicines through participating Pradhan Mantri Bhartiya Janaushadhi Kendras.",eligibility:"Availability and purchase conditions vary by medicine and local centre.",benefits:["Lower-cost generic medicines","Participating medicine outlets","Pharmacy guidance"],how:"Contact a nearby participating Jan Aushadhi Kendra and confirm medicine stock.",contact:"Confirm outlet and medicine details using official PMBI resources."},
    {id:"state-care",name:"State health assistance",description:"State and district health support programmes may help eligible residents with care costs.",eligibility:"State-specific rules, income criteria and verification apply.",benefits:["Potential treatment assistance","Diagnostics or medicine support may apply","Local public health services"],how:"Ask your district health office or government hospital help desk about current schemes.",contact:"Contact your district health office for verified programme guidance."}
  ]
};
