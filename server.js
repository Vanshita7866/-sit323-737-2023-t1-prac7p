const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 8080;
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 


const uri = `mongodb://user:password@localhost:3000/database`;

const client = new MongoClient(uri);

try {
  
  client.connect();
} catch (e) {
  console.error(e);
}

 

app.get("/read", async (req, res) => {
  try {
   
    const nfts = await client.db().collection("collection").find().toArray();
    res.json(nfts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ERROR" });
  }
});

app.post("/insert", async (req, res) => {
   try {
     const data = req.body; 
     const result = await client.db().collection("collection").insertOne(data);
     res.json({ message: "DATA ENTERED SUCCESSFULLY" });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "ERROR" });
   }
 });


app.get("/readone/:name", async (req, res) => {
  try {
    const data = req.params.name;
    const result = await client.db().collection("collection").findOne({ name: data });
    if (!result) {
      res.status(404).json({ error: "DATA NOT FOUND" });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ERROR" });
  }
});

app.put("/update/:name", async (req, res) => {
  try {
    const dName = req.params.name;
    const data = req.body; 
    const result = await client.db().collection("collection").updateOne({ name: dName }, { $set: data });
    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "DATA NOT FOUND" });
    } else {
      res.json({ message: "DATA UPDATED SUCCESSFULLY" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ERROR" });
  }
});

app.delete("/delete/:name", async (req, res) => {
  try {
    const dName = req.params.name;
    const result = await client.db().collection("collection").deleteOne({ name: dName });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "DATA NOT FOUND" });
    } else {
      res.json({ message: "DATA DELETED SUCCESSFULLY" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ERROR" });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

