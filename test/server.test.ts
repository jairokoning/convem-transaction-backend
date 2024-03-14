test("should create new AWS SQS", async() => {
  fetch('http://localhost:3000/transactions', {
  method: "POST",
  headers: {"Content-type": "application/json;charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(json => console.log(json)) 
  .catch(err => console.log(err));
})