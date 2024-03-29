<?php defined('SYSPATH') OR exit();
/**
 * Provides a shortcut to get Database related objects for [making queries](../database/query).
 *
 *
 * @package    Database
 * @category   Core

 */
class Core_DB {

    /**
     * Create a new [Database_Query] of the given type.
     *
     *     // Create a new SELECT query
     *     $query = DB::query(Database::SELECT, 'SELECT * FROM users');
     *
     *     // Create a new DELETE query
     *     $query = DB::query(Database::DELETE, 'DELETE FROM users WHERE id = 5');
     *
     * Specifying the type changes the returned result. When using
     * `Database::SELECT`, a [Database_Query_Result] will be returned.
     * `Database::INSERT` queries will return the insert id and number of rows.
     * For all other queries, the number of affected rows is returned.
     *
     * @param   integer  type: Database::SELECT, Database::UPDATE, etc
     * @param   string   SQL statement
     * @return  Database_Query
     */
    public static function query($type, $sql,$param = NULL){

        //Вернет уже заполненный массив с параметрами
        if(!empty($param) AND is_array($param)){
            $query = DB::query($type, DB::placehold($sql));
            $query->parameters($args[2]);
            return $query;
        }else{
            return new Database_Query($type, $sql);
        }
    }

    public static function placehold(){
        if(!isset(Registry::i()->prefix)){
            Registry::i()->prefix = Core::config('database')->default['prefix'];
        }
        $args = func_get_args();    
        $tmpl = array_shift($args);

        // Заменяем все __ на префикс, но только необрамленные кавычками
        $tmpl = preg_replace('/([^"\'0-9a-z_])__([a-z_]+[^"\'])/i', "\$1".Registry::i()->prefix."\$2", $tmpl);
    
        if(!empty($args) AND ($str = array_shift($args) AND is_array($str))){
            $tmpl = Str::__($tmpl,$str);
        }
        
        return $tmpl;
    }
    /**
     * Create a new [Database_Query_Builder_Select]. Each argument will be
     * treated as a column. To generate a `foo AS bar` alias, use an array.
     *
     *     // SELECT id, username
     *     $query = DB::select('id', 'username');
     *
     *     // SELECT id AS user_id
     *     $query = DB::select(array('id', 'user_id'));
     *
     * @param   mixed   column name or array($column, $alias) or object
     * @param   ...
     * @return  Database_Query_Builder_Select
     */
    public static function select($columns = NULL){
        return new Database_Query_Builder_Select(func_get_args());
    }

    /**
     * Create a new [Database_Query_Builder_Select] from an array of columns.
     *
     *     // SELECT id, username
     *     $query = DB::select_array(array('id', 'username'));
     *
     * @param   array   columns to select
     * @return  Database_Query_Builder_Select
     */
    public static function select_array(array $columns = NULL){
        return new Database_Query_Builder_Select($columns);
    }

    /**
     * Create a new [Database_Query_Builder_Insert].
     *
     *     // INSERT INTO users (id, username)
     *     $query = DB::insert('users', array('id', 'username'));
     *
     * @param   string  table to insert into
     * @param   array   list of column names or array($column, $alias) or object
     * @return  Database_Query_Builder_Insert
     */
    public static function insert($table = NULL, array $columns = NULL){
        return new Database_Query_Builder_Insert($table, $columns);
    }

    /**
     * Create a new [Database_Query_Builder_Update].
     *
     *     // UPDATE users
     *     $query = DB::update('users');
     *
     * @param   string  table to update
     * @return  Database_Query_Builder_Update
     */
    public static function update($table = NULL){
        return new Database_Query_Builder_Update($table);
    }

    /**
     * Create a new [Database_Query_Builder_Delete].
     *
     *     // DELETE FROM users
     *     $query = DB::delete('users');
     *
     * @param   string  table to delete from
     * @return  Database_Query_Builder_Delete
     */
    public static function delete($table = NULL){
        return new Database_Query_Builder_Delete($table);
    }

    /**
     * Create a new [Database_Expression] which is not escaped. An expression
     * is the only way to use SQL functions within query builders.
     *
     *     $expression = DB::expr('COUNT(users.id)');
     *     $query = DB::update('users')->set(array('login_count' => DB::expr('login_count + 1')))->where('id', '=', $id);
     *     $users = ORM::factory('user')->where(DB::expr("BINARY `hash`"), '=', $hash)->find();
     *
     * @param   string  expression
     * @return  Database_Expression
     */
    public static function expr($string){
        return new Database_Expression($string);
    }
    
    static function escape($string){
        $pdo = Database::instance();
        return $pdo->escape($string);
    }
    static function shot($type, $sql, $params = NULL){
        
        $query = DB::query($type, DB::placehold($sql));
        
        if(!empty($params) AND is_array($params))
            $query->parameters($params);
        
        return $query->execute();
    }

}
