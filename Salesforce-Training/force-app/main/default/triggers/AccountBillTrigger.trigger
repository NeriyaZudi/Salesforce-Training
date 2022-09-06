trigger AccountBillTrigger on OpportunityLineItem (after update) {

    List<Account_Bill__c> productsToBill = new List<Account_Bill__c> ();
    List<Account_Bill__c> AccountBills = new List<Account_Bill__c> ();
    List<Account_Bill__c> productsToBillUpdate = new List<Account_Bill__c> ();
    List<Opportunity> opportunities = new List<Opportunity>();
    List<String> names = new List<String>();
    List<String> already = new List<String>();
    Id OpportunityID = Trigger.new[0].OpportunityID;
    Id AccountId;
    

    opportunities = [SELECT Id,AccountId FROM Opportunity WHERE Id=:OpportunityID];
    AccountId = opportunities[0].AccountId;
    AccountBills = [SELECT Id,Account__c,Name,Product_Name__c,Product_Quantity__c,Product_Price__c FROM Account_Bill__c WHERE Account__c=:AccountId];
    for(Account_Bill__c bill:AccountBills){
        names.add(bill.Name);
    }
    // new account bill
    if(AccountBills.size()==0){
        for(OpportunityLineItem oli:Trigger.new){
            Account_Bill__c newProd = new Account_Bill__c();
            newProd.Account__c=AccountId;
            newProd.Name = oli.Name;
            newProd.Product_Name__c = oli.Name;
            newProd.Product_Quantity__c = 1;
            newProd.Product_Price__c=oli.UnitPrice;
            productsToBill.add(newProd);
            already.add(newProd.Name);
            continue;
        } 
}else{
    for(OpportunityLineItem oli:Trigger.new){
        for(Account_Bill__c bill:AccountBills){
                if(oli.Name==bill.Name){

                    bill.Product_Quantity__c = bill.Product_Quantity__c +1;
                    productsToBillUpdate.add(bill);
                    already.add(bill.Name);

                    continue;
                }
            }
        }
}
    for(OpportunityLineItem oli:Trigger.new){
        if(!already.contains(oli.Name)){

            Account_Bill__c prod = new Account_Bill__c();
            prod.Account__c=AccountId;
            prod.Name = oli.Name;
            prod.Product_Name__c = oli.Name;
            prod.Product_Quantity__c = 1;
            prod.Product_Price__c=oli.UnitPrice;
            productsToBill.add(prod);

            continue;
        }

    }
 
      
    // System.debug('new account bill'+productsToBill);
    // System.debug('update account bill'+productsToBillUpdate);
    try {
        if(productsToBill.size()>0){
            insert productsToBill;
        }
        if(productsToBillUpdate.size()>0){
            update productsToBillUpdate;
        }
    } catch(DmlException e) {
        System.debug('The following exception has occurred: ' + e.getMessage());
    }
    

}