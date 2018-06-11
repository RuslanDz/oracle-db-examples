/* Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   em_insert2.js
 *
 * DESCRIPTION
 *   Array DML example using executeMany() with bind-by-position syntax.
 *   Use demo.sql to create the required schema.
 *
 *****************************************************************************/

var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

var doconnect = function(cb) {
  oracledb.getConnection(dbConfig, cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

var dotruncate = function(conn, cb) {
  conn.execute("TRUNCATE TABLE em_tab", function (err) {
    return cb(err, conn);
  });
};

var doinsert = function(conn, cb) {
  var sql = "INSERT INTO em_tab VALUES (:1, :2)";

  var binds = [
    [1, "Test 1 (One)"],
    [2, "Test 2 (Two)"],
    [3, "Test 3 (Three)"],
    [4, null],
    [5, "Test 5 (Five)"]
  ];

  // bindDefs is optional for IN binds but it is generally recommended.
  // Without it the data must be scanned to find sizes and types.
  var options = {
    autoCommit: true,
    bindDefs:
    [ { type: oracledb.NUMBER },
      { type: oracledb.STRING, maxSize: 15 }
    ] };

  conn.executeMany(sql, binds, options, function (err, result) {
    if (err)
      return cb(err, conn);
    else {
      console.log("Result is:", result);
      return cb(null, conn);
    }
  });
};

async.waterfall(
  [
    doconnect,
    dotruncate,
    doinsert
  ],
  function (err, conn) {
    if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
    if (conn)
      dorelease(conn);
  });
