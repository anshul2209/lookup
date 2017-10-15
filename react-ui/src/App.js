import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import './App.css';
import ReactTable from 'react-table';
import Filter from './FilterComponent';
class App extends Component {
  constructor(params){
    super(params);
    this.state = {
      providerlist: [],
      loading: true,
      filterOpen: false
    };
  }
  getData(){
    var url = '/providers?state=ID';
    fetch(url)
      .then(res => res.json())
      .then(res => {
        let providerlist = res.data;
        this.setState({ providerlist: providerlist, loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ providerlist: [], loading: false });
      });  
  }
  componentDidMount(){
    this.getData();
  }
  jsonToQueryString(json) {
      let serializeArray = [];
      for(let key in json){
        if(json.hasOwnProperty(key) && key !== 'providerlist' && key !=='loading' && json[key]){
          serializeArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]));
        }
      }
      if(serializeArray.length){
        return '?' + serializeArray.join('&');
      }else {
        return ''; 
      }
  }
  changeLoadingStatus(){
    this.setState({ loading: true });
  }
  handleToggle(){
    this.setState({
      filterOpen: !(this.state.filterOpen)
    });
  }
  handleClose(){
    if(this.state.filterOpen){
      this.setState({
        filterOpen: !(this.state.filterOpen)
      });
    }
  }
   providerlist(data){
    console.log('the data after call is', data);
    this.setState({ providerlist: data, loading: false });
  }
  render() {
    const providerlist = this.state.providerlist;
    let sampleArray = [];
    let sampleJson = providerlist[0];
    let headerhashmap = {
      'drgdefinition': 'Definition',
      'providerid': 'ProviderId',
      'providername': 'Provider Name',
      'provideraddress': 'Provider Street Address',
      'providercity': 'Provider City',
      'providerstate': 'Provider State',
      'providerzipcode': 'Provider Zip Code',
      'hospitalregion': 'Hospital Region Description',
      'totaldischarges': 'Total Discharges',
      'avgcoveredcharges': 'Average Covered Charges($)',
      'avgtotalpayments': 'Average Total Payments($)',
      'avgmedicarepayments': 'Average Medicare Payments($)'
    }
    for(let key in sampleJson){
      sampleArray.push({
        Header: headerhashmap[key],
        accessor: key
      });
    };
    return (
      <Grid fluid className="App">
        <Row id="wrapper">
          <Col xs={12} className="toggleFilter">
            <div className="buttonWrapper">
              <button type="button" className="filterbtn btn btn-success" onClick={this.handleToggle.bind(this)}>Filter</button>
              <button type="button" className="closebtn filterbtn btn btn-success" onClick={this.handleClose.bind(this)}>Close</button>
            </div>  
          </Col>
          <Col xs={12} className={ this.state.filterOpen ? 'filtersection' : 'filtersectiondesktop' } >
            <Filter providerlist={this.providerlist.bind(this)} changeLoadingStatus={this.changeLoadingStatus.bind(this)}/>
          </Col>
          <Col xs={12} className="contentsection">
            <div>
              <ReactTable
                noDataText="No Data"
                data={providerlist}
                columns={ sampleArray }
                defaultPageSize={10}
                className="-striped -highlight centre"
                loading={this.state.loading}
                height={50}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
