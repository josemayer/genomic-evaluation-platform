#include <iostream>
#include <string>
#include <deque>
#include <map>

using std::string;
using argList = std::deque<string>;

std::map<string, void(*)(argList)> commandMap;

void help(argList args) {
	std::cout<<"Usage: <program> <command> <arguments...>"<<std::endl;
	std::cout<<"To learn more about some command use \"help\" as the first command argument"<<std::endl;
	std::cout<<"Available commands:"<<std::endl;
	for (auto it = commandMap.begin(); it != commandMap.end(); it++) {
		std::cout<<"- "<<it->first<<std::endl;
	}
	exit(1);
}

void test(argList args) {

}

int main(int argc, char *argv[]) {
	commandMap = {
		{"test", test},
		{"help", help},
	};

	if (argc < 2) {
		help({});
		return 1;
	}

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

	fn->second(arguments);
}

