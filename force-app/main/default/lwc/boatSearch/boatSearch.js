import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class BoatSearch extends NavigationMixin(LightningElement) {
  isLoading = false;
  findABoatLabel = "Find a Boat";

  handleLoading() {
    this.isLoading = true;
  }
  handleDoneLoading() {
    this.isLoading = false;
  }
  createNewBoat() {
    // Use NavigationMixin to open a standard form to create a new boat object
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Boat__c", // Boat standard object in the ERD
        actionName: "new"
      }
    });
  }
  searchBoats(event) {
    // Event is coming from the form, it handles the search boat event.
    const boatTypeId = event.detail.boatTypeId;
    this.template
      .querySelector("c-boat-search-results")
      .searchBoats(boatTypeId);
  }
}
