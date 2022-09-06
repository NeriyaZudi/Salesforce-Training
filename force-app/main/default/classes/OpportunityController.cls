public with sharing class OpportunityController {
  private static Id priceBookId= Id.valueOf('01s7R000005MhuZQAS');
  public OpportunityController() {
  }
  @AuraEnabled(cacheable=true)
  public static List<Opportunity> getOpportunityList() {
    
    List<Opportunity> opportunities = [
      SELECT Id, Name, Pricebook2Id
      FROM Opportunity
      WHERE Pricebook2Id = :PricebookId
    ];
    System.debug(opportunities);
    return !opportunities.isEmpty() ? opportunities : null;
  }
  @AuraEnabled(cacheable=true)
  public static String getPriceBookName() {
    
    List<Pricebook2> names = [
      SELECT Id, Name
      FROM Pricebook2
      WHERE Id = :priceBookId
    ];
    return names[0].Name;
  }
  @AuraEnabled
  public static void updateOpportunity(String oppId,List<OpportunityLineItem> selectedProducts){
    List<OpportunityLineItem> olisToUpdate = new List<OpportunityLineItem>();
    List<OpportunityLineItem> products = [
      SELECT
        Id,
        Name,
        OpportunityId,
        Quantity,
        UnitPrice,
        TotalPrice,
        PricebookEntry.Name,
        PricebookEntry.Product2.Family
      FROM OpportunityLineItem
      WHERE OpportunityId = :oppId
    ];

    for(OpportunityLineItem item:selectedProducts){
      for (OpportunityLineItem product : products) {
        if(item.Id==product.Id){
          product.Quantity=product.Quantity-1;
          olisToUpdate.add(product);
        }
    
      }
      
    }
    if(!olisToUpdate.isEmpty()){
    System.debug('update oli'+olisToUpdate);
    try{
      update olisToUpdate;
    } catch(DmlException e) {
      System.debug('The following exception has occurred: ' + e.getMessage());
  }
    
    }
  }
}