import React, { Component } from 'react'
import axios from "axios"
import { Bar, Line } from 'react-chartjs-2';

const url=process.env.REACT_APP_URL;

class ReportApp extends Component {

    state = {
        chartDataBar: {},
        chartDataLineCounts: {},
        chartDataLinePrice: {},
        productTotal: 0,
        totAmountTotal: 0,
        totAmountExpenses: 0
    }
    
    peticionGetInventory=()=>{
        axios.get(url + "/inventory/all").then(response=>{
            var productNameList=[];
            var productCountList=[];
            var totAmountTotal=0;
            var totAmountExpenses=0;

            for (let key in response.data){
                totAmountTotal=totAmountTotal + response.data[key].amountTotal;

                if(response.data[key].amountExpenses > 0){
                    productNameList.push(response.data[key].productName);
                    productCountList.push(response.data[key].amountExpenses);
                    console.log(response.data[key].amountTotal)
                    totAmountExpenses=totAmountExpenses + response.data[key].amountExpenses;
                }
            }

            this.setState({productTotal: response.data.length});            
            this.setState({totAmountTotal: totAmountTotal});
            this.setState({totAmountExpenses: totAmountExpenses});
            this.setState({
                chartDataBar: {
                    labels: productNameList,
                    datasets: [{
                        label: 'Productos',
                        data: productCountList,
                        backgroundColor: 'green'
                    }]
                }
            })
        }).catch(error=>{
            console.log(error.message);
        })
    }

    // Funcion para agrupar y contar campos/valor iguales de un JSON
    groupByKeyCounts=(dataJson, key)=> {
        var counts = dataJson.reduce(function(p, c) {
             if (!p.hasOwnProperty(c[key])) {
                 p[c[key]] = 0;
             }
             p[c[key]]++;
             return p;
         }, {});
         var countsExtended=[];
         for(let key in counts){
             countsExtended.push({name: key, value: counts[key]})
         }
     
         return countsExtended;
     };

    // Funcion para agrupar y sumar los importes con campos/valor iguales de un JSON
    groupByKeySumPrice=(dataJson, key)=> {
        var acumu = 0
        var totPrice = dataJson.reduce(function(p, c) {
            if (!p.hasOwnProperty(c[key])) {
                acumu = 0
            }
            acumu = acumu + (c['unitPrice']*c['amount'])
            p[c[key]] = acumu
    
            return p;
        }, {});
        var totPriceExtended=[];
        for(let key in totPrice){
            totPriceExtended.push({name: key, value: totPrice[key]})
        }
     
         return totPriceExtended;
     };

    peticionGetExpenses=()=>{
        axios.get(url + "/expenses/all").then(response=>{
            var countsExtended = this.groupByKeyCounts(response.data,'date');
            var totPriceExtended = this.groupByKeySumPrice(response.data,'date');
            var countsLabs=[];
            var countsLabsVal=[];
            var priceLabs=[];
            var priceLabsVal=[];
            var maxItem = 7;

            for(let key in countsExtended){
                countsLabs.push(countsExtended[key].name)
                countsLabsVal.push(countsExtended[key].value)
            }

            for(let key in totPriceExtended){
                priceLabs.push(totPriceExtended[key].name)
                priceLabsVal.push(totPriceExtended[key].value)
            }

            this.setState({
                chartDataLineCounts: {
                    labels: countsLabs.splice(-maxItem),
                    datasets: [
                        {
                        label: "Ventas",
                        data: countsLabsVal.splice(-maxItem),
                        fill: false,
                        borderWidth:4,
                        backgroundColor: 'green',
                        borderColor:'green',
                        responsive:true
                        },
                    ],
                },
                chartDataLinePrice: {
                    labels: priceLabs.splice(-maxItem),
                    datasets: [
                        {
                        label: "Importes Gs",
                        data: priceLabsVal.splice(-maxItem),
                        fill: false,
                        borderWidth:4,
                        backgroundColor: 'green',
                        borderColor:'green',
                        responsive:true
                        },
                    ],
                }
            })
        }).catch(error=>{
            console.log(error.message);
        })
    }

    componentDidMount() {
        this.peticionGetInventory();
        this.peticionGetExpenses();
    }

    render(){
        return (
            <>
                <div className='py-4 mb-2 text-center bg light'>
                    <h1 className='h3 mb-0'>INFORMACION DEL NEGOCIO</h1>
                </div>
                <div className='py-4 mb-2 bg light'>
                    <span className='md:ml-8 btn btn-outline-dark btn-lg btn-block'><i className="bi bi-bag-check"/>    PRODUCTOS: {this.state.productTotal}</span>
                    <span className='md:ml-8 btn btn-outline-dark btn-lg btn-block'><i className="bi bi-bag-check"/>    TOTALES: {this.state.totAmountTotal}</span>
                    <span className='md:ml-8 btn btn-outline-dark btn-lg btn-block'><i className="bi bi-cart-check"/>    VENDIDOS: {this.state.totAmountExpenses}</span>
                </div>
                <div className='row'>
                    <div className='col-md-6 p-2'>
                        <Line
                            data={this.state.chartDataLineCounts}
                            options={{
                                title: {
                                    display: true,
                                    text: "Cantidad de ventas en la semana",
                                    fontSize: 25
                                },
                                responsive: true,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                    <div className='col-md-6 p-2'>
                        <Bar
                            data={this.state.chartDataBar}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Cantidad de productos vendidos',
                                    fontSize: 25
                                },
                                responsive: true,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                    <div className='col-md-6 p-2'>
                        <Line
                            data={this.state.chartDataLinePrice}
                            options={{
                                title: {
                                    display: true,
                                    text: "Importes acumulados en la semana",
                                    fontSize: 25
                                },
                                responsive: true,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default ReportApp;
  