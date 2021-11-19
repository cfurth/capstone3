use capstone3;

create table Claims (
	Claim_ID varchar(50) NOT NULL PRIMARY KEY,
	Sub_Name varchar(100),
	DOS Date,
	Amount Decimal(9,2),
	Acct_Num int,
	aa_pass tinyint
);


commit;

