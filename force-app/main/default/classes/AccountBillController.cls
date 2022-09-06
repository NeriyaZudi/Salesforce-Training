public with sharing class AccountBillController {
    @AuraEnabled(cacheable=true)
    public static List<Account_Bill__c> getAccountBillProducts(
      String opp_id
    ) {
      Id oppId = Id.valueOf(opp_id);
      Id accId = null;
      List<Opportunity> opps = [SELECT Id,AccountId FROM Opportunity WHERE Id=:opp_id];
      if(!opps.isEmpty()){
        if(opps[0].AccountId==null){
          return null;
        }
        else{
          accId = Id.valueOf(opps[0].AccountId);
        }
      }
      List<Account_Bill__c> products = [
        SELECT
          Id,
          Account__c,
          Name,
          Product_Name__c,
          Product_Quantity__c,
          Product_Price__c
        FROM Account_Bill__c
        WHERE Account__c = :accId
      ];
      System.debug('cart '+products);
      return !products.isEmpty() ? products : null;
    }
    @AuraEnabled
    public static Boolean purchaseProduct(String opp_id,Integer amount){
      Id oppId = Id.valueOf(opp_id);
      Id accId = null;
      List<Opportunity> opps = [SELECT Id,AccountId FROM Opportunity WHERE Id=:opp_id];
      if(!opps.isEmpty()){
        if(opps[0].AccountId==null){
          return false;
        }
        else{
          accId = Id.valueOf(opps[0].AccountId);
        }
      }
      List<Account> accountsToUpdate = new List<Account>();
      List<Account> accs = [SELECT Id,isPurchase__c,Total_Amount__c FROM Account WHERE Id=:accId];
      for(Account a:accs){
        a.isPurchase__c=true;
        a.Total_Amount__c=amount;
        accountsToUpdate.add(a);
      }

      System.debug('UPDATE ACCOUNTS CART'+accountsToUpdate);
      if(!accountsToUpdate.isEmpty()){
        try{
          update accountsToUpdate;
          return true;
        } catch(DmlException e) {
          System.debug('The following exception has occurred: ' + e.getMessage());
          return false;
      }
      }
      return true;
     

    }


}