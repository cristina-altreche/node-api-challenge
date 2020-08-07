const express = require("express");
const Projects = require("../data/helpers/projectModel");
const Actions = require("../data/helpers/actionModel");
const router = express.Router();

/////////GET REQUESTS//////////////
//ABLE TO GET ALL PROJECTS
//Throw error if no projects.
router.get("/", (req, res) => {
  Projects.get().then((data) => {
    if (data.length === 0) {
      res.status(404).json({ message: "There were no projects found" });
    } else {
      res.status(200).json(data);
    }
  });
});

//ABLE TO GET PROJECTS BY ID
router.get("/:id", validateId, (req, res) => {
  res.status(200).json(req.query);
});

//ABLE TO GET LIST OF ACTIONS FOR A PROJECT
router.get("/:id/actions", validateId, (req, res) => {
  Projects.getProjectActions(req.query.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((data) => {
      res.status(500).json({ error: "Something went wrong with server" });
    });
});

/////////POST REQUESTS////////////
//ABLE TO POST A NEW PROJECT
router.post("/", validateProject, (req, res) => {
  res.status(201).json(req.body);
});

//ABLE TO POST AN ACTION TO A CURRENT PROJECT
router.post("/:id/actions", validateAction, (req, res) => {
  res.status(201).json(req.body);
});

////////////DELETE////////////////
//ABLE TO DELETE A PROJECT
router.delete("/:id", validateId, (req, res) => {
  Projects.remove(req.query.id)
    .then((data) => {
      if (data.length === 0) {
        res.status(404).json({ message: "Project does not exisit" });
      } else {
        res.status(200).json("Project has been deleted");
      }
    })
    .catch((data) => {
      res.status(500).json({ error: "Something went wrong in the server" });
    });
});

////////////PUT ////////////////////
//ABLE TO PUT(UPDATE) A PROJECT NAME
router.put("/:id", validateId, (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    Projects.update(req.query.id, req.body)
      .then((data) => {
        Projects.get(req.params.id).then((query) => {
          res.status(200).json(query);
        });
      })
      .catch((data) => {
        res.status(500).json({ error: "Something went wrong with the" });
      });
  }
});

///////////CUSTOM MIDDLEWARE//////////

//VALIDATES THE ID
function validateId(req, res, next) {
  Projects.get(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(400).json({ message: "invalid project id" });
      } else {
        req.query = data;
      }
      next();
    })
    .catch((data) =>
      res.status(500).json({ error: "Something went wrong with server side" })
    );
}

//VALIDATES PROJECTS
function validateProject(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing project body data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing project name" });
  } else if (!req.body.description) {
    res.status(400).json({ message: "Missing project description" });
  } else {
    Projects.insert(req.body)
      .then((data) => {
        req.body = data;
        next();
      })
      .catch((data) => {
        res.status(500).json({ error: "Something went wrong with server" });
      });
  }
}

//VALIDATES ACTIONS
function validateAction(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing action body data" });
  } else if (!req.body.description) {
    res.status(400).json({ message: "missing action description" });
  } else if (!req.body.notes) {
    res.status(400).json({ message: "missing action notes" });
  } else {
    Actions.insert({ ...req.body, project_id: req.params.id })
      .then((data) => {
        req.actions = data;
        next();
      })
      .catch((data) => {
        res.status(500).json({ error: "Something went wrong with server" });
      });
  }
}

module.exports = router;
