#!/usr/bin/python

### FILE: RecordEncounterData.py
### DESCRIPTION: Script to make it faster to stub out a new D&D stats file and fill in encounter data.
### DESCRIPTION (CONT'D): EncounterDescriptions.txt will have to be updated manually.
### AUTHOR: K. A. (tachk)
### CREATED: 2014.06.22
### UPDATED: 2014.07.19
### TODO: Clean up to use obj instead of crazy lists.
### TODO: Exception handling for invalid types entered.

def initNewStatsFile():
	print "\n***Starting new stats file...\n"
	
	campaignName = raw_input("Enter campaign name (no spaces, CamelCase): ")
	sessionDate = raw_input("Enter session date (YYYY.mm.dd): ")
	
	statsFileName = sessionDate + "_" + campaignName + ".tsv"
	statsFileFullPath = "./" + statsFileName
	fSessionStatsFile = open(statsFileFullPath, 'w')
	#print statsFileFullPath
	#TODO: Return error if file already exists.
	
	#Add headers to top of new stats file
	fGlossaryFile = open('./Glossary.tsv', 'r')
	strSessionsStatsCol = ""

	for line in fGlossaryFile:
		strCurrentLine = line.split("\t")
		strSessionsStatsCol += strCurrentLine[0] + "\t"
	
	#Trim off the extra tab at the end
	strSessionsStatsCol = strSessionsStatsCol[:-1]
	strSessionsStatsHeader = strSessionsStatsCol + "\n"
	fSessionStatsFile.write(strSessionsStatsHeader)

	return fSessionStatsFile

def addSubsequentEncounter(numCurrEncOfSession):
	print "\n***Creating new encounter for this date...\n"
	
	numEncountersProcessed = numCurrEncOfSession + 1
	
	return numEncountersProcessed

def collectPlayerStatsForCurrEnc(numCurrEncOfSession, aPlayerStatsPerEncounter):
	print "\n***Entering stats for new player in this encounter...\n"
	
	strEncounterID = str(numCurrEncOfSession)

	#Ask for player's name and other stats (see Glossary.tsv)
	userPlayerName = raw_input("Name of character (type DM or GM if player is DM): ")
	userTotCFA     = raw_input("Total crit fails on attacks: ")
	userTotCHA     = raw_input("Total crit hits on attacks: ")
	userTotRnd     = raw_input("Total number of rounds in encounter: ")
	userTotCFDST   = raw_input("Total number of crit fail death saves: ")
	userTotCHDST   = raw_input("Total number of crit hit death saves: ")
	userTotDST     = raw_input("Total death saving throws rolled: ")
	userTotCFNDST  = raw_input("Total crit fail saving throws: ")
	userTotCHNDST  = raw_input("Total crit hit saving throws: ")
	userTotNDST    = raw_input("Total saving throws rolled: ")
	userTotHit     = raw_input("Total no. attacks that hit: ")
	userTotMiss    = raw_input("Total no. attacks that missed: ")

	if ((userPlayerName.lower() == "dm") or (userPlayerName.lower() == "gm")):
		userTotMobs = raw_input("Total mobs controlled: ")
	else:
		userTotMobs = "None"

	#Add this player's stats to the list
	strPlayerStatsThisEnc = strEncounterID + "\t" + userPlayerName + "\t" + userTotCFA + "\t" + userTotCHA + "\t" + userTotRnd + "\t" + userTotCFDST + "\t" + userTotCHDST + "\t" + userTotDST + "\t" + userTotCFNDST + "\t" + userTotCHNDST + "\t" + userTotNDST + "\t" + userTotHit + "\t" + userTotMiss + "\t" + userTotMobs + "\n"
	aPlayerStatsPerEncounter.append(strPlayerStatsThisEnc)
	
	#Inquire whether there are other players to process
	userInputMorePlayers = raw_input("Any other players this encounter? ")
	userInputMorePlayers = userInputMorePlayers.lower()
	
	if ((userInputMorePlayers == "y") or (userInputMorePlayers == "yes")):
		collectPlayerStatsForCurrEnc(numCurrEncOfSession, aPlayerStatsPerEncounter)
	else:
		#If not, we're done with this encounter... onto the next
		print "No other players to add. Moving on to next encounter...\n"
	
	return aPlayerStatsPerEncounter

def addPlayerStatsToFile(fSessionStatsFile, aPlayerStatsPerEncounter):
	print "\n***Adding player's stats for encounter to file...\n"
	
	#For each entry in the array (each row represents a unique enc + player combo)
	#Add player stats to file
	for item in aPlayerStatsPerEncounter:
		#Python is barfing when I try to write "item" to file even though it's already type string...
		#Explicitly setting type to string to see if that works.
		strStatsLine = str(item)
		fSessionStatsFile.write(strStatsLine)
	
	#Once all stats collected, write them to file
	fSessionStatsFile.close()
	
	return 0

def printGlossary():
	print "\n***Printing glossary...\n"
	
	# Load glossary file
	fGlossaryFile = open('./Glossary.tsv', 'r')
	
	# Load each line in the file. For each line, load the line then...
	for line in fGlossaryFile:
		# Split line on commas
		aSplitLine = line.split("\t")
		# First column is stat column's name
		print "\_Column name\n" + aSplitLine[0]
		# Second column is the type for the corresponding stat column
		print "\_Column type\n"+ aSplitLine[1]
		# Third column is the description of the column
		print "\_Column description\n" + aSplitLine[2]
	
	print "\n"
	fGlossaryFile.close()
	print "*****"

def cancel():
	print "\n***Exiting script...\n"
	return 0

def askForSubsequentEnc(bThereAreMoreEncToProcess, numCurrEncOfSession, aPlayerStatsPerEncounter):
	userInputSubsequentEnc = raw_input("\nWere there any other encounters this session? ")
	userInputSubsequentEnc = userInputSubsequentEnc.lower()
	
	if ((userInputSubsequentEnc == "y") or (userInputSubsequentEnc == "yes")):
		bThereAreMoreEncToProcess = True
		
		#For each subsequent encounter, get players' stats
		numCurrEncOfSession = addSubsequentEncounter(numCurrEncOfSession)
		aPlayerStatsPerEncounter = collectPlayerStatsForCurrEnc(numCurrEncOfSession, aPlayerStatsPerEncounter)
	else:
		bThereAreMoreEncToProcess = False
		print "No other encounters to process. Finishing...\n"
		
	return bThereAreMoreEncToProcess, aPlayerStatsPerEncounter

def askForUserInput():
	userInputIntroChoice = raw_input("\nDo you want to do (continue/quit/glossary)? ")
	userInputIntroChoice = userInputIntroChoice.lower()
	# TODO: Enforce that userInputIntroChoice is a string.

	if ((userInputIntroChoice == "c") or (userInputIntroChoice == "continue")):
		fStatsForCurrentSession = initNewStatsFile()
		
		#Ask for first encounter of the session
		numCurrEncOfSession = 1
		#For the first encounter, get players' stats
		aPlayerStatsPerEncounter = []
		aPlayerStatsPerEncounter = collectPlayerStatsForCurrEnc(numCurrEncOfSession, aPlayerStatsPerEncounter)

		#Ask for subsequent encounters of the session
		bThereAreMoreEncToProcess = True
		
		while (bThereAreMoreEncToProcess == True):
			rAskForSubseqEnc = askForSubsequentEnc(bThereAreMoreEncToProcess, numCurrEncOfSession, aPlayerStatsPerEncounter)
			bThereAreMoreEncToProcess = rAskForSubseqEnc[0]
			aPlayerStatsPerEncounter = rAskForSubseqEnc[1]

		addPlayerStatsToFile(fStatsForCurrentSession, aPlayerStatsPerEncounter)
		print "***Stats written to file... all done! Exiting...\n"
		
	elif ((userInputIntroChoice == "q") or (userInputIntroChoice == "quit")):
		cancel()
		
	elif ((userInputIntroChoice == "g") or (userInputIntroChoice == "glossary")):
		printGlossary()
		askForUserInput()
		
	else:
		print "I can't do that, Dave. Try another command...\n"
		askForUserInput()
	
	return 0

def introExperience():
	print "\nWhat you'll be asked to do:"
	print "Step 1: Enter the date for the session."
	print "Step 2: Enter the encounter ID."
	print "Step 3: Enter the first player's name for the encounter."
	print "Step 4: Stat-by-stat, you'll enter the player's stats for the encounter."
	print "\nYou'll repeat steps 3 and 4 for each player in the encounter."
	print "If you have other encounters to enter stats for, you'll start again at step 2."
	print "\nIf you don't know what the stats mean, type \"glossary\" (without the quotes).\n"
	print "************************************************************"
	
	return 0

def main():
	print "\n*****Starting script to record stats for a D&D session*****"
	introExperience()
	askForUserInput()
	
	# First, prompt user to enter date for encounter.
	# Then, ask user to enter the encounter ID and first player's name.
	# For each stat, ask the user to enter the player's stats for that encounter.
	# If a stat wasn't collected or otherwise doesn't apply, user should enter "None" as the value.
	# Ask user if there are any more players to record stats for that encounter.
	# If so, ask user to enter next player's stats. If not, ask if there're other encounters this date.
	# If there are other encounters this date, ask for the next encounter ID.
	# If there aren't other encounters this date, close the stats file.
	
	return 0

if __name__ == '__main__':
	main()
