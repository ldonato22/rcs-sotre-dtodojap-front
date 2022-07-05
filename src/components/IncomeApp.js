import React, { Component } from 'react'
import axios from "axios"
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
import Select from 'react-select'

const url=process.env.REACT_APP_URL;

class IncomeApp extends Component {

  state={
    errorMessages: {},
    modalInsertar: false,
    productOption:[],
    productListIncome:[],
    form:{}
  }

  validate = () => {
    let form = this.state.form
    let errors = {}
    let validityStatus = true

    console.log(form["productId"])

    if(form){
      if (form["productId"] === undefined ){
        validityStatus = false
        errors["productId"] = "Debe seleccionar un producto."
      }
      if (form["invoice"] === undefined ){
        validityStatus = false
        errors["invoice"] = "Se debe ingrasar una factura."
      }
      if (form["amount"] === undefined ){
        validityStatus = false
        errors["amount"] = "Se debe ingresar una cantidad."
      }
      if (form["unitPrice"] === undefined ){
        validityStatus = false
        errors["unitPrice"] = "Debe ingresar un importe."
      }
    } else {
      validityStatus = false
      errors["form"] = "Debe completar el formulario."
    }

    this.setState({errorMessages: errors})
    return validityStatus
  }  

  peticionGetInventory=()=>{
    axios.get(url + "/inventory/all").then(response=>{
      var options=[];
      for (let key in response.data){
        options.push({
            label: "[" + response.data[key].providerName + " - " + response.data[key].providerCode + "] - " + response.data[key].productName + " - " + response.data[key].productDesc, 
            name: "[" + response.data[key].providerName + " - " + response.data[key].providerCode + "] - " + response.data[key].productName + " - " + response.data[key].productDesc,
            value: response.data[key].id
          })
      }
      this.setState({productOption: options});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionGetIncome=()=>{
    axios.get(url + "/income/all").then(response=>{

      // Ordeno la respuesta por el id mas nuevo a mas viejo.
      response.data.sort(function (a, b) {
        if (a.id < b.id) {
          return 1;
        }
        if (a.id > b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      this.setState({productListIncome: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost=async()=>{
    if(this.validate()){
    await axios.post(url + "/income/add",this.state.form).then(response=>{
        this.modalInsertar();
        this.peticionGetIncome();
        this.peticionGetInventory();
      }).catch(error=>{
        console.log(error.message);
      })
    }
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  handleChange=async e=>{
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  }

  componentDidMount() {
    this.peticionGetIncome();
    this.peticionGetInventory();
  }

  getPrductDesc(id){
    for(let key in this.state.productOption){
      if(id === this.state.productOption[key].value){
        return this.state.productOption[key].name
      }
    }
  }
  
  render(){
    const {form}=this.state;
    const {productOption}=this.state;
    const {errorMessages}=this.state;
    const formatUnitPrice = new Intl.NumberFormat('de-DE');

  return (
    <>
    <div className='py-4 mb-2 bg light d-flex justify-content-center'>
        <button className="btn btn-primary btn-lg btn-block" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>AGREGAR ENTRADA</button>
      </div>
      <div className='py-4 mb-2 bg light'>
        <h1 className='h2 mb-0'>Lista de productos en la entrada ({ this.state.productListIncome.length })...</h1>
      </div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>[Proveedor] - Nombre Producto</th>
            <th>Factura</th>
            <th>Cantidad</th>
            <th>Precio Unitario Gs.</th>
          </tr>
        </thead>
        <tbody>
          {this.state.productListIncome.map(product=>{
            return(
              <tr key={product.id}>
              <td>{product.date}</td>
              <td>{this.getPrductDesc(product.productId)}</td>
              <td>{product.invoice}</td>
              <td>{product.amount}</td>
              <td>{formatUnitPrice.format(product.unitPrice)}</td>
            </tr>
            )
          })}
        </tbody>
      </Table>

      <Modal isOpen={this.state.modalInsertar}>
        <ModalHeader style={{display: 'block'}}>
          <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
          <p style={{color: "red"}}>{errorMessages?errorMessages.form: ''}</p>
            <Select
              name="productId"
              placeholder="Buscar producto..."
              value={productOption?productOption.value: 0}
              options={productOption}
              onChange={(productOption)=> {this.handleChange({target: { name:'productId', value: productOption.value }})}}
            />
            <p style={{color: "red"}}>{errorMessages?errorMessages.productId: ''}</p>
            <br />
            <input className="form-control" type="text" name="invoice" id="invoice" placeholder='Factura' onChange={this.handleChange} value={form?form.invoice: ''}/>
            <p style={{color: "red"}}>{errorMessages?errorMessages.invoice: ''}</p>
            <br />
            <label htmlFor="amount">Cantidad</label>
            <input className="form-control" type="text" name="amount" id="amount" placeholder='0' onChange={this.handleChange} value={form?form.amount: ''}/>
            <p style={{color: "red"}}>{errorMessages?errorMessages.amount: ''}</p>
            <br />
            <label htmlFor="unitPrice">Precio Unitario Gs.</label>
            <input className="form-control" type="number" step="1000" name="unitPrice" id="unitPrice" placeholder='0' onChange={this.handleChange} value={form?form.unitPrice: ''}/>
            <p style={{color: "red"}}>{errorMessages?errorMessages.unitPrice: ''}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          {
            this.state.tipoModal==='insertar'?
              <button className="btn btn-success" onClick={()=>this.peticionPost()}>
              Insertar
              </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
              Actualizar
              </button>
          }
            <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </>
  );
}
}
export default IncomeApp;