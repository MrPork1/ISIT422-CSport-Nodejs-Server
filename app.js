const {MongoClient} = require('mongodb');


async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = "mongodb+srv://iluvjuntae:somuch@haleynisit420.cj3rn.mongodb.net/?retryWrites=true&w=majority";


  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      
      //put into the funciton and then added to the db
      await creatCustomer(client,
        {
            Email:"sample2@gmail.com",
            Username:"user2",
            Fname:"Ban",
            Lname:"Eish",  
            Role: 2,
        }
    );

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }

}
main().catch(console.error);

async function creatCustomer(client, newCust){
  const result = await client.db("CSportsDB").collection("UserCollection").insertOne(newCust);
  console.log(`New  created with the following id: ${result.insertedId}`);
}











// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();

//   console.log("Databases:");
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };


// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
