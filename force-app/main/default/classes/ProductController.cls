public with sharing class ProductController {
  @AuraEnabled(cacheable=true)
  public static List<OpportunityLineItem> getOpportunityLineItemsList(
    String opportunity_id
  ) {
    Id oppId = Id.valueOf(opportunity_id);
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
    // System.debug(products);
    return !products.isEmpty() ? products : null;
  }
}