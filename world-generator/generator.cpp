#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <deque>
#include <map>
#include <cstdlib>
#include <time.h>

using std::string;
using argList = std::deque<string>;
#define fs std::filesystem

#define WORLD string("./world/")

std::map<string, int(*)(argList)> commandMap;

void assert_directory_exists(string path) {
	if (!fs::exists(path)) {
		fs::create_directory(path);
	}
}

int help(argList args) {
	std::cout<<"Usage: <program> <command> <arguments...>"<<std::endl;
	std::cout<<"To learn more about some command use \"help\" as the first command argument"<<std::endl;
	std::cout<<"Available commands:"<<std::endl;
	for (auto it = commandMap.begin(); it != commandMap.end(); it++) {
		std::cout<<"- "<<it->first<<std::endl;
	}
	return 1;
}

int newCondition(argList args) {
	if (args[0] == "help") {
		return 0;
	}

	string path = WORLD + "conditions/";

	assert_directory_exists(path);

	path += args[0];
	if (fs::exists(path)) {
		std::cerr<<"Condition with the same name already exists"<<std::endl;
		return 1;
	}

	std::cout<<"writing to "<<path<<std::endl;
	std::ofstream file(path);

	int x;
	int i = 0;
	int min = 10;
	do {
		x = rand();
		file << (x ^ -1) << std::endl;
		i++;
	} while (x <= RAND_MAX / ((i + min - 1) / min));

	return 0;
}

int main(int argc, char *argv[]) {
	if (argc < 2) {
		help({});
		return 1;
	}

	commandMap = {
		{"new_condition", newCondition},
		{"help", help},
	};

	srand(time(NULL));

	argList arguments;
	for (int i = 1; i < argc; i++) {
		arguments.push_back(argv[i]);
	}

	string command = arguments.front();
	arguments.pop_front();

	auto fn = commandMap.find(command);
	if (fn == commandMap.end()) {
		fn = commandMap.find("help");
	}

	if (fn->first != "help" && !fs::exists(WORLD)) {
		fs::create_directory(WORLD);
	}

	return fn->second(arguments);
}

