import { LightningElement, wire } from "lwc";
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";

export default class BoatSearchForm extends LightningElement {
  searchOptions; // Array that saves boat types
  error = undefined;
  selectedBoatTypeId = ""; // Variable that saves the value of the search option

  //Get BoatTypes
  @wire(getBoatTypes) // Call apex method with return values
  boatTypes({ error, data }) {
    // Return values from apex method used as parameter for the function
    if (data) {
      this.searchOptions = data.map(type => {
        return { label: type.Name, value: type.Id };
    });
      const allTypes = { label: "All Types", value: "" };
      this.searchOptions.unshift(allTypes);
    
    } else if (error) {
      console.error(error);
      this.searchOptions = undefined;
      this.error = error;
      
    }
  }

  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.detail.value;
    const searchEvent = new CustomEvent("search", {
      detail: {
        boatTypeId: this.selectedBoatTypeId
      }
    });
    this.dispatchEvent(searchEvent);
  }
}
