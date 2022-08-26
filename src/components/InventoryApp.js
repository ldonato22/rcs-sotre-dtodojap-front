import React, { Component } from 'react'
import axios from "axios"
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
import Select from 'react-select'

const url=process.env.REACT_APP_URL;

class InventoryApp extends Component {

  state={
    errorMessages: {},
    modalInsertar: false,
    modalMovDeposit: false,
    productOption:[],
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

  validatePut = () => {
    let form = this.state.form
    let option = this.state.productOption
    let errors = {}
    let validityStatus = true

    if(form){
      if (form["id"] === '' || form["id"] === undefined ){
        validityStatus = false
        errors["id"] = "Debe seleccionar un producto."
      }
      if (form["amountIncome"] === '' || form["amountIncome"] === undefined ){
        validityStatus = false
        errors["amountIncome"] = "Se debe ingresar una cantidad."
      }
      else {
        for(let key in option){
          if(form["id"] === option[key].value){
            if(form["amountIncome"] > option[key].amountIncomeDeposit){
              validityStatus = false
              errors["amountIncome"] = "La cantidad es mayor a lo que hay en el deposito."
            }
          }
        }
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
            amountIncomeDeposit: response.data[key].amountIncomeDeposit,
            value: response.data[key].id
          })
      }

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

      this.setState({productOption: options});
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

  peticionPut=async()=>{
    if(this.validatePut()){
    await axios.put(url + "/deposit-to-local",this.state.form).then(response=>{
        this.modalMovDeposit();
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

  modalMovDeposit=()=>{
    this.setState({modalMovDeposit: !this.state.modalMovDeposit});
    this.setState({errorMessages: {}});
  }

  handleChange=async e=>{
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }});
      this.setState({errorMessages: {}});
  }

  componentDidMount() {
    this.peticionGetInventory();
  }
  
  render(){
    const {form}=this.state;
    const {productOption}=this.state;
    const {errorMessages}=this.state;

  return (
    <>
    <div className='py-4 mb-2 bg light d-flex justify-content-center'>
      <button className="btn btn-primary btn-lg btn-block" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>AGREGAR PRODUCTO</button>
      <button className="md:ml-8 btn btn-warning btn-lg btn-block" onClick={()=>{this.setState({form: null, tipoModal: 'movDeposit'}); this.modalMovDeposit()}}>MOVER DEL DEPOSITO</button>
    </div>
    <div className='py-4 mb-2 bg light'>
      <h1 className='h2 mb-0'>Listado de productos ({ this.state.productListInventory.length })...</h1>
    </div>
    <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>[Proveedor] [Cod Proveedor] - Nombre Producto</th>
            <th>Descripcion Producto</th>
            <th>Cant. en deposito</th>
            <th>Cant. en local</th>
            <th>Cant. venta</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          { this.state.productListInventory.length > 0 ? 
          this.state.productListInventory.map(product => (
            <tr key={product.id}>
              <td>{product.date}</td>
              <td>[{product.providerName}] [{product.providerCode}] - {product.productName}</td>
              <td>{product.productDesc}</td>
              <td>{product.amountIncomeDeposit}</td>
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
          <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>
          <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
        </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.modalMovDeposit}>
        <ModalHeader style={{display: 'block'}}>
          <span style={{float: 'right'}} onClick={()=>this.modalMovDeposit()}>x</span>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
          <p style={{color: "red"}}>{errorMessages?errorMessages.form: ''}</p>
            <Select
              name="id"
              placeholder="Buscar producto..."
              value={productOption?productOption.value: 0}
              options={productOption}
              onChange={(productOption)=> {this.handleChange({target: { name:'id', value: productOption.value }})}}
            />
            <p style={{color: "red"}}>{errorMessages?errorMessages.id: ''}</p>
            <br />
            <label htmlFor="amountIncome">Cantidad</label>
            <input className="form-control" type="text" name="amountIncome" id="amountIncome" placeholder='0' onChange={this.handleChange} value={form?form.amountIncome: ''}/>
            <p style={{color: "red"}}>{errorMessages?errorMessages.amountIncome: ''}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <button className="btn btn-success" onClick={()=>this.peticionPut()}>Mover</button>
          <button className="btn btn-danger" onClick={()=>this.modalMovDeposit()}>Cancelar</button>
        </ModalFooter>
      </Modal>
  </>
  );
}
}
export default InventoryApp;