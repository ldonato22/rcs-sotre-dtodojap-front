import React, { Component } from 'react'
import axios from "axios"
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'

const url=process.env.REACT_APP_URL;

class InventoryApp extends Component {

  state={
    errorMessages: {},
    modalInsertar: false,
    productListInventory:[],
    form:{}
  }

  validate = () => {
    let form = this.state.form
    let errors = {}
    let validityStatus = true

    if(form){
      if (form["providerName"] === '' || form["providerName"] === undefined ){
        validityStatus = false
        errors["providerName"] = "Debe ingresar un nombre de proveedor."
      }
      if (form["providerCode"] === '' || form["providerCode"] === undefined ){
        validityStatus = false
        errors["providerCode"] = "Debe ingresar un codigo de producto proveedor."
      }
      if (form["productName"] === '' || form["productName"] === undefined ){
        validityStatus = false
        errors["productName"] = "Debe ingresar un nombre de producto."
      }
      if (form["productDesc"] === '' || form["productDesc"] === undefined ){
        validityStatus = false
        errors["productDesc"] = "Debe ingresar una descripcion."
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

      this.setState({productListInventory: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost=async()=>{
    if(this.validate()){
      await axios.post(url + "/inventory/add",this.state.form).then(response=>{
        this.modalInsertar();
        this.peticionGetInventory();
      }).catch(error=>{
        console.log(error.message);
      })
    }
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
    this.setState({errorMessages: {}});
  }

  handleChange=async e=>{
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value,
        stockInitial: 0
      }});
  }

  componentDidMount() {
    this.peticionGetInventory();
  }
  
  render(){
    const {form}=this.state;
    const {errorMessages}=this.state;

  return (
    <>
    <div className='py-4 mb-2 bg light d-flex justify-content-center'>
      <button className="btn btn-primary btn-lg btn-block" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>AGREGAR PRODUCTO</button>
    </div>
    <div className='py-4 mb-2 bg light'>
      <h1 className='h2 mb-0'>Listado de productos ({ this.state.productListInventory.length })...</h1>
    </div>
    <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>[Proveedor] - Nombre Producto</th>
            <th>Descripcion Producto</th>
            <th>Cant. entrada</th>
            <th>Cant. venta</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          { this.state.productListInventory.length > 0 ? 
          this.state.productListInventory.map(product => (
            <tr key={product.id}>
              <td>{product.date}</td>
              <td>[{product.providerName}] - {product.productName}</td>
              <td>{product.productDesc}</td>
              <td>{product.amountIncome}</td>
              <td>{product.amountExpenses}</td>
              <td>{product.amountTotal}</td>
            </tr>
          )):<></>}
        </tbody>
      </Table>

    <Modal isOpen={this.state.modalInsertar}>
      <ModalHeader style={{display: 'block'}}>
        <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
        <p style={{color: "red"}}>{errorMessages?errorMessages.form: ''}</p>
          <input className="form-control" type="text" name="providerName" id="providerName" placeholder='Nombre Proveedor' onChange={this.handleChange} value={form?form.providerName: ''}/>
          <p style={{color: "red"}}>{errorMessages?errorMessages.providerName: ''}</p>
          <br />
          <input className="form-control" type="text" name="providerCode" id="providerCode" placeholder='Codigo Proveedor' onChange={this.handleChange} value={form?form.providerCode: ''}/>
          <p style={{color: "red"}}>{errorMessages?errorMessages.providerCode: ''}</p>
          <br />
          <input className="form-control" type="text" name="productName" id="productName" placeholder='Nombre producto' onChange={this.handleChange} value={form?form.productName: ''}/>
          <p style={{color: "red"}}>{errorMessages?errorMessages.productName: ''}</p>
          <br />
          <input className="form-control" type="text" name="productDesc" id="productDesc" placeholder='Descripcion producto' onChange={this.handleChange} value={form?form.productDesc: ''}/>
          <p style={{color: "red"}}>{errorMessages?errorMessages.productDesc: ''}</p>
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
export default InventoryApp;