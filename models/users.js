const pool = require('../config/database');


module.exports = {
    /**
    *   Used to create a new user in the registered users table and also add the user in global database.
    */
    create : (data,callback)=>{
        pool.query(`insert into users(phoneNumber,name,email,password) values(?,?,?,?)`,
        [
            data.phoneNumber,
            data.name,
            data.email,
            data.password
        ],
        (err,results)=>{
            if(err) return callback(err);
            pool.query(`insert ignore into globalusers(phoneNumber,name,spamCount) values(?,?,?)`,[
                data.phoneNumber,
                data.name,
                0
            ])
 
            return callback(null,results);
        }
        )
    },

     /**
      * Used to search the user by phone number, firstly in the registered users db, then in global db
      */
    getUserByNumber : (number, callback)=>{
        pool.query(
            `select name from users where phoneNumber = ?`,
            [number],
            (err,result)=>{
                if(err) return callback(err);
                if(result.length == 0){
                    pool.query(
                        `select name, spamCount from globalusers where phoneNumber = ? `,
                        [number],
                        (error,result)=>{
                            if(error) return callback(error);
                            return callback(null,result);
                        }
                    );   
                }
                else {
                    return callback(null,result[0]);
                }
            }
        )
    },

    /**
     * Used to search the user by name in global db
     */
    getUserByName : (name, callback)=>{
        pool.query(
            `select name, phoneNumber, spamCount from globalusers where name like ? UNION select name, phoneNumber, spamCount from globalusers where name like ?`,
            [`${name}%`,`%${name}%`],
            (err,result)=>{
                if(err) return callback(err);
                else return callback(null,result);
            }
        )
    },

    /**
     * Used to check if a particular number exists in the global database or not
     */
    userExistInGB :(number,callback)=>{
        pool.query(`select * from globalusers where phoneNumber = ?`,
        [number],
        (err,res)=>{
            if(err) return callback(err);
            return callback(null,res);
        })
    },

    /**
     * Creates a new user in the global db if it has been reported as spam by someone and setting its spam count as 1
    */
    reportNewUser :(number,callback)=>{
        pool.query(`INSERT INTO globalusers (phoneNumber, name, spamCount) VALUES (?, ?, ?)`,
        [number,'',1],
        (err,res)=>{
            if(err) return callback(err);
            return callback(null,res);
        })
    },

    /**
     * Updates the spam count of the user reported as spam
     */
    reportOldUser : (number,callback)=>{
        pool.query(`UPDATE globalusers SET spamCount = spamCount+1 WHERE phoneNumber = ?`,
        [number],
        (err,res)=>{
            if(err) return callback(err);
            return callback(null,res);
        })
    },

    /**
     * Checks the spam table if someone has already reported someone as spam or not before
     * 
     * If not the entry is created in the spamTable 
    */
    alreadyReported:(spamNumber, userReportedBy,callback)=>{
        pool.query(`select * from spamTable where spamNumber = ? and reportedBy = ?`,
        [spamNumber,userReportedBy.phoneNumber],
        (err,res)=>{
            if(err) return callback(err);
            if(res.length==0){
                pool.query(`insert into spamTable(spamNumber,reportedBy) values(?,?)`,
                [spamNumber,userReportedBy.phoneNumber],
                (err,res)=>{
                    if(err) return callback(err);
                });
                return callback(null,false);
            }
            return callback(null,true);
        }
        )
    },

    /**
     * Used to get the user details to verify password 
    */
    getUserForLogin : (number,callback)=>{
        pool.query(
            `select * from users where phoneNumber = ?`,
            [number],
            (err,result)=>{
                if(err) return callback(err);
                return callback(null,result[0]);
            }
        )
    }
}