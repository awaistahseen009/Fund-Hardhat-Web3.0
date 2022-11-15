//SPDX-License-Identfier:MIT
pragma solidity ^0.8.0;
import "./PriceConverter.sol";
error notOwner();
contract FundMe{
    using PriceConverter for uint256;
    address private immutable i_owner;
    uint256 private minUSD=50*1e18;
    address[] public funders;
    AggregatorV3Interface private priceFeed;
    mapping(address => uint256) public addMoneyMapping;
    address  public priceFeedReturn;
    constructor (address priceFeedAddress){
        priceFeed=AggregatorV3Interface(priceFeedAddress);
        i_owner=msg.sender;
        priceFeedReturn=priceFeedAddress;

    }
    function fund() public payable{
        require(msg.value.getConversionRate(priceFeed)>=minUSD,"Dont have enough eth");
        funders.push(msg.sender);
        addMoneyMapping[msg.sender]+=msg.value; 
    }
    modifier onlyOwner{
        if(msg.sender!=i_owner)
        revert notOwner();
        _;
    }
    function withdraw() public onlyOwner {
        for(uint256 i=0;i<funders.length;i++){
            address funder=funders[i];
            addMoneyMapping[funder]=0;
        }
        funders= new address[](0);
        (bool callSuccess,)=payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess,"Send Failed !");
    }
    function PriceFeed() public view returns(address){
        return priceFeedReturn;
    }
    function getFunder(uint256 index) public view returns(address)
    {
        return funders[index];
    }
}
