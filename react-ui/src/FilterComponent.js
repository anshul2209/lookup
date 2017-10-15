import React, { Component } from 'react';
import Select from 'react-select';
import { Col, Row } from 'react-bootstrap';
import './FilterComponents.css';
export default class Filter extends Component {
  constructor(props){
    super(props);
    this.state = {
      min_discharges: undefined,
      max_discharges: undefined,
      min_average_covered_charges: '',
      max_average_covered_charges: '',
      min_average_medicare_payments: '',
      max_average_medicare_payments: '',
      state: '',
      selectedvalue: []
    };
  }
  handlestate(val){
    this.setState({state: val});
  }
  handleSelectChange(val) {
    this.setState({ selectedvalue: val });
  }
  handleChange(e){
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
  }
  handlefilter(event){
    event.preventDefault();
    this.getData();
  }
  getData(){
    var url = '/providers';
    var state = this.state;
    var querystring = this.jsonToQueryString(state);
    url += querystring;
    this.props.changeLoadingStatus();
    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log('data recieved is', res);
        let providerlist = res.data;
        this.props.providerlist(providerlist);
      })
      .catch(err => {
        console.log(err);
        this.setState({ providerlist: [], loading: false });
      })


    /*axios.get(url)
    .then(res => {
      var response = res.data;
      var responsestatus = response.success;
      var providerlist = response.data;
      if(responsestatus){
        this.props.providerlist(providerlist);
        // this.setState({ providerlist });
      }
    });*/
  }
  jsonToQueryString(json) {
      var serializeArray = [];
      for(var key in json){
        if(json.hasOwnProperty(key) && key !== 'providerlist' && json[key]){
          serializeArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]));
        }
      }
      if(serializeArray.length){
        return '?' + serializeArray.join('&');
      }else {
        return ''; 
      }
  }
  render(){
    console.log(this.state);
    const providerstate = require('./providestate.json');
    const stateoptions = providerstate.map(state=>{
      return {
        'value': state,
        'label': state
      }
    });
    let options = [
      { value: 'providername', label: 'Provider Name' },
      { value: 'provideraddress', label: 'Provider Street Address' },
      { value: 'providercity', label: 'Provider City' },
      { value: 'providerstate', label: 'Provider State' },
      { value: 'providerzipcode', label: 'Provider Zip Code' },
      { value: 'hospitalregion', label: 'Hospital Region Description' },
      { value: 'totaldischarges', label: 'Total Discharges' },
      { value: 'avgcoveredcharges', label: 'Average Covered Charges' },
      { value: 'avgtotalpayments', label: 'Average Total Payments' },
      { value: 'avgmedicarepayments', label: 'Average Medicare Payments' }
    ];
    return(
      <Row>
        <Col md={4} xs={12}>
          <div id="state" className="filter">
            <label>Select State</label>
            <Select
              value={this.state.state}
              options={stateoptions}
              searchable={false}
              placeholder="Select State"
              simpleValue
              onChange={this.handlestate.bind(this)}
            />
          </div>
        </Col>
        <Col md={4} xs={12}>
          <div id="selectedfields" className="filter">
            <label>Select Fields To Show</label>
            <Select
              value={this.state.selectedvalue}
              options={options}
              multi
              searchable={false}
              simpleValue
              placeholder="Select Fields To Show"
              onChange={this.handleSelectChange.bind(this)}
            />
          </div>
        </Col>
        <Col md={4} xs={12}>
          <div id="discharges" className="filter">
            <label>Enter the Discharge Range</label>
            <div className="filter-wrapper">
              <div className="form-group align"> 
                <input type="text" id="min_discharges" className="form-control" placeholder="1" value={this.state.min_discharges} name="min_discharges" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="min_average_covered_charges">Minimum</label>
              </div>
              <span id="minus-sign">&mdash;</span>
              <div className="form-group align"> 
                <input type="text" id="max_discharges" className="form-control" placeholder="999" value={this.state.max_discharges} name="max_discharges" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="min_average_covered_charges">Maximum</label>
              </div>
            </div>
          </div>
        </Col>
        <Col md={4} xs={12}>
          <div id="coveredcharges" className="filter">
            <label>Enter the Average Covered Charges Range($)</label>
            <div className="filter-wrapper">
              <div className="form-group align"> 
                <input type="text" id="min_average_covered_charges" placeholder="1$" className="form-control" value={this.state.min_average_covered_charges} name="min_average_covered_charges" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="min_average_covered_charges">Minimum</label>
              </div>
              <span id="minus-sign">&mdash;</span>
              <div className="form-group align"> 
                <input type="text" id="max_average_covered_charges" placeholder="999999$" className="form-control" value={this.state.max_average_covered_charges} name="max_average_covered_charges" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="min_average_covered_charges">Maximum</label>
              </div>
            </div>
          </div>
        </Col>
        <Col md={4} xs={12}>
          <div id="medicarecharges" className="filter">
            <label>Enter the Average Medicare Charges Range($)</label>
            <div className="filter-wrapper">
              <div className="form-group align"> 
                <input type="text" id="min_average_medicare_payments" placeholder="1$" className="form-control" value={this.state.min_average_medicare_payments} name="min_average_medicare_payments" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="min_average_covered_charges">Minimum</label>
              </div>
              <span id="minus-sign">&mdash;</span>
              <div className="form-group align"> 
                <input type="text" id="max_average_medicare_payments" placeholder="999999$" className="form-control" value={this.state.max_average_medicare_payments} name="max_average_medicare_payments" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="min_average_covered_charges">Maximum</label>
              </div>
            </div>
          </div>
        </Col>
        <Col md={4} xs={12}>
          <div id="filterbutton" className="filter">
            <button type="button" id="filter_button" className="btn btn-primary" onClick={this.handlefilter.bind(this)}>Filter</button>
          </div>
        </Col>
      </Row>
    )
  }
}