const buttonProjetoAmbev = document.getElementById('btnProjetoAmbev')
const buttonProjetoBridgestone = document.getElementById('btnProjetoBridgestone')
const buttonProjetoColgate = document.getElementById('btnProjetoColgate')

const tableBodyProdutos = document.getElementById('tbodyProdutos')

const containerClientes = document.getElementById('containerClientes')
const containerConteudo = document.getElementById('containerConteudo')

const buttonAdicionarProduto = document.getElementById('btnAdicionarProduto')
const formCadastroProduto = document.getElementById('formCadastroProduto')
const inputNomeProduto = document.getElementById('inputNomeProduto')
const inputImagemProduto = document.getElementById('inputImagemProduto')
const imagemProdutoCadastro = document.getElementById('imgProdutoCadastro')
const btnSalvarProduto = document.getElementById('btnSalvarProduto')

const progressLoading = document.getElementById('progressLoading')
const progressLoadingValue = document.getElementById('progressLoadingValue')

const CLIENTE_AMBEV = 1
const CLIENTE_BRIDGESTONE = 2
const CLIENTE_COLGATE = 3

let idClienteSelecionado = CLIENTE_AMBEV
let nomeClienteSelecionado = "Ambev"

let idProdutoEditado = 0

onload = function() {

   fetch(`http://localhost:5085/Clientes`)
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }
      return res.json();
   })
   .then((data) => {

      console.log("data", data)      
      clientesExistem(data)
   })
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:" + error)
   })
}

buttonProjetoAmbev.onclick = function() {
    
    buttonProjetoAmbev.disabled = true    
    buttonProjetoBridgestone.disabled = false
    buttonProjetoColgate.disabled = false

    idClienteSelecionado = CLIENTE_AMBEV
    nomeClienteSelecionado = "Ambev"
    consultarProdutoClienteAPI(CLIENTE_AMBEV)
 }

 buttonProjetoBridgestone.onclick = function() {
    
    buttonProjetoAmbev.disabled = false    
    buttonProjetoBridgestone.disabled = true
    buttonProjetoColgate.disabled = false

    idClienteSelecionado = CLIENTE_BRIDGESTONE
    nomeClienteSelecionado = "Bridgestone"
    consultarProdutoClienteAPI(CLIENTE_BRIDGESTONE)
 }

 buttonProjetoColgate.onclick = function() {
    
    buttonProjetoAmbev.disabled = false    
    buttonProjetoBridgestone.disabled = false
    buttonProjetoColgate.disabled = true

    idClienteSelecionado = CLIENTE_COLGATE
    nomeClienteSelecionado = "Colgate"
    consultarProdutoClienteAPI(CLIENTE_COLGATE)
 }

 buttonAdicionarProduto.onclick = function() {

   idProdutoEditado = 0

   formCadastroProduto.reset()

   if (!imagemProdutoCadastro.classList.contains("collapse")){

      imagemProdutoCadastro.classList.add("collapse")
   }   
 }

 inputImagemProduto.onchange = function() {

   const [file] = inputImagemProduto.files
   if (file) {
      imagemProdutoCadastro.src = URL.createObjectURL(file)
   }

   imagemProdutoCadastro.classList.remove("collapse")
 }

 btnSalvarProduto.onclick = function() {

   let url = imagemProdutoCadastro.src

   fetch(url)
  .then(resposta => resposta.blob())
  .then(blob => {
    let reader = new FileReader();
    reader.onloadend = function() {

      let imageBase64 = reader.result

      const jsonProduto = {         
         "nome": inputNomeProduto.value,
         "imagem": imageBase64
      }
      
      console.log("Salvar", jsonProduto)
   
      if (idProdutoEditado == 0){
   
         criarProdutoAPI(jsonProduto)
      }else{
   
         editarProdutoAPI(jsonProduto, idProdutoEditado)
      }

    }
    reader.readAsDataURL(blob);
  });
        
   
 }

function clientesExistem(clientes){

   if (clientes.length == 0){
      alert("Nenhum cliente cadastrado no Banco de Dados")
   }else{
      containerClientes.classList.remove("invisible");
   }
}

function criarProdutoAPI(produto){

   let bodyProduto = {
      "id": 0,
      "cliente": {
         "id": idClienteSelecionado,
         "nome": nomeClienteSelecionado
      },
      "nome": produto.nome,
      "imagem": produto.imagem
   }

   console.log("bodyProduto", bodyProduto)

   fetch(`http://localhost:5085/`, 
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyProduto)
   })
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }

      const msgUser = "Produto " +bodyProduto.nome+ " criado com Sucesso!"
      console.log(msgUser)      
      alert(msgUser)   
      consultarProdutoClienteAPI(idClienteSelecionado)
   })   
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:" + error)
   })
 }
 
function consultarProdutoClienteAPI(idCliente){
   
   fetch(`http://localhost:5085/Produtos/PorCliente?idCliente=${idCliente}`)
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }
      return res.json();
   })
   .then((data) => {

      console.log("data", data)      
      montarTabelaProdutosUI(data)
      consultarDadosHistoricoAPI(idCliente)  
   })
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:" + error)
   })

 }

function montarTabelaProdutosUI(jsonDataCliente){
   
   containerConteudo.classList.remove("collapse")

   tableBodyProdutos.innerHTML = "";

   for (let produto of jsonDataCliente) {

      let row = document.createElement('tr');
      let cellId = document.createElement('td');
      cellId.textContent = produto.id;
      row.appendChild(cellId);

      let cellNome = document.createElement('td');
      cellNome.textContent = produto.nome;
      row.appendChild(cellNome);

      let cellImagem = document.createElement('td');
      let img = document.createElement('img');
      img.width =60
      img.height=60
      img.src = produto.imagem;
      cellImagem.appendChild(img);
      row.appendChild(cellImagem);

      let cellEdit = document.createElement('td');
      let buttonEdit = document.createElement('button');
      buttonEdit.classList.add("btn-edit")
      let iconEdit = document.createElement('i');
      iconEdit.classList.add("fa-regular")
      iconEdit.classList.add("fa-pen-to-square")
      iconEdit.classList.add("fa-2x")
      buttonEdit.appendChild(iconEdit)

      buttonEdit.onclick = function () {         
         editCadastroProduto(produto)
      };

      cellEdit.appendChild(buttonEdit);
      row.appendChild(cellEdit);

      let cellDelete = document.createElement('td');
      let buttonDelete = document.createElement('button');
      buttonDelete.classList.add("btn-delete")
      let iconDelete = document.createElement('i');
      iconDelete.classList.add("fa-regular")
      iconDelete.classList.add("fa-trash-can")
      iconDelete.classList.add("fa-2x")
      buttonDelete.appendChild(iconDelete)

      cellDelete.appendChild(buttonDelete);
      row.appendChild(cellDelete);

      tableBodyProdutos.appendChild(row);
   }
 }

function editCadastroProduto(produto){

   console.log("Editar", produto)
   
   idProdutoEditado = produto.id

   inputNomeProduto.value = produto.nome
   imagemProdutoCadastro.src = produto.imagem

   if (imagemProdutoCadastro.classList.contains("collapse")){

      imagemProdutoCadastro.classList.remove("collapse")
   }  
}

function editarProdutoAPI(produto, idProdutoEditado){

   let bodyProduto = {
      "id": idProdutoEditado,
      "cliente": {
         "id": idClienteSelecionado,
         "nome": nomeClienteSelecionado
      },
      "nome": produto.nome,
      "imagem": produto.imagem
   }

   fetch(`http://localhost:5085/Produtos`, 
      {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyProduto)
   })
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }
      
      const msgUser = "Produto " +bodyProduto.nome+ " editado com Sucesso!"
      console.log(msgUser)      
      alert(msgUser)    
      consultarProdutoClienteAPI(idClienteSelecionado)
   })
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:" + error)
   })
 }

function deleteCadastroProduto(produto){

   console.log("Deletar", produto)
   
   deletarProdutoAPI(produto)
}

function deletarProdutoAPI(produtoDeletar){

   fetch(`http://localhost:5085/Produtos/${produtoDeletar.id}`, 
      {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
   })
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }
      
      const msgUser = "Produto " +produtoDeletar.nome+ " deletado com Sucesso!"
      console.log(msgUser)      
      alert(msgUser)
      consultarProdutoClienteAPI(idClienteSelecionado)
   })
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:", error)
   })
 }

function loadDadosHistoricoAPI(){

   let bodyCliente = {
      "id": idClienteSelecionado,
      "nome": nomeClienteSelecionado
   }

   console.log("bodyCliente", bodyCliente)

   fetch(`http://localhost:5085/Historico`, 
      {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyCliente)
   })
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }

      const msgUser = "Historico " +bodyCliente.nome+ " gerado com Sucesso!"
      console.log(msgUser)      
      
      buttonLoadHistorico.disabled = false  
      progressLoading.classList.add("collapse")
      consultarDadosHistoricoAPI(idClienteSelecionado)
   })   
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:" + error)
   })
}

function consultarDadosHistoricoAPI(idCliente){

   fetch(`http://localhost:5085/Historico?idCliente=${idCliente}`)
   .then((res) => {
      if (!res.ok) {
         alert(`HTTP error! Status: ${res.status}`)
         throw new Error
               (`HTTP error! Status: ${res.status}`);
      }
      return res.json();
   })
   .then((data) => {

      console.log("data", data) 
      plotarGrafico(data)       
   })
   .catch((error) => {
      alert('Error: ' + error)
      console.error("Unable to fetch data:" + error)
   }) 
 }

function plotarGrafico(jsonDataHistorico){

   console.log("jsonDataHistorico", jsonDataHistorico)

   const xValues = ['13:28:51.73','13:28:52.73','13:28:53.73','13:28:54.73','13:28:55.73','13:28:56.73','13:28:57.73','13:28:58.73','13:28:59.73','13:29:00.73','13:29:01.73'];
   const yValues = [100,100,100,100,100,100,100,100,100,100,100];

   new Chart("chartHistorico", {
   type: "line",
   data: {
      labels: xValues,
      datasets: [{
         fill: false,
         lineTension: 0,
         backgroundColor: "rgba(10,186,181,1.0)",
         borderColor: "rgba(10,186,181,0.1)",
         data: yValues
      }]
   },
   options: {
      legend: {display: false},
      scales: {
         yAxes: [{ticks: {min: 0, max:200}}],
      }
   }
   });

}